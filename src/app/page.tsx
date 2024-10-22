"use client";

import { PixGenerationResponse } from "@/types/pix";
import {
  LockClosedIcon,
  QrCodeIcon,
  ShieldCheckIcon,
} from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Toast from "@radix-ui/react-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import LoadingSpinner from "./components/loading-spinner";
import ToastMessage, { ToastMessageProps } from "./components/toast";

const FormSchema = z.object({
  fullName: z
    .string({
      required_error: "Nome Completo obrigatório",
    })
    .min(3, "Nome Completo deve ter no mínimo 3 caracteres")
    .max(100, "Nome Completo deve ter no máximo 100 caracteres"),
  email: z
    .string({
      required_error: "E-mail obrigatório",
    })
    .email("E-mail inválido"),
  document: z
    .string({
      required_error: "CPF obrigatório",
    })
    .length(11, "CPF deve ter 11 caracteres"),
});

type FormData = z.infer<typeof FormSchema>;

export default function Checkout() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const router = useRouter();

  const [toastMessageProps, setToastMessageProps] = useState<ToastMessageProps>(
    {
      type: "error",
      open: false,
      title: "Erro ao gerar QR Code",
      description: "Tente novamente mais tarde",
      onOpenChange: (open) => {
        setToastMessageProps((prev) => ({ ...prev, open }));
      },
    } as ToastMessageProps
  );

  const [loading, setLoading] = useState(false);

  async function onSubmit(data: FormData) {
    setLoading(true);

    try {
      const payload = JSON.stringify({
        amountInCents: 7711,
        chargedUser: data,
      });

      const pixResponse = await fetch("/api/pix-qr-codes", {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
        next: {
          revalidate: 0,
        },
      });

      const pixResponseData: PixGenerationResponse = await pixResponse.json();

      if (!pixResponseData.qrcode) {
        setToastMessageProps({
          type: "error",
          open: true,
          title: "Erro ao gerar QR Code",
          description: "Tente novamente mais tarde",
          onOpenChange: (open) => {
            setToastMessageProps((prev) => ({ ...prev, open }));
          },
        });

        setLoading(false);
        return;
      }

      router.push(
        `/pix-transaction/${encodeURIComponent(
          pixResponseData.qrcode.content
        )}?pixReference=${encodeURIComponent(
          pixResponseData.qrcode.reference_code
        )}?userName=${encodeURIComponent(
          data.fullName
        )}&userEmail=${encodeURIComponent(data.email)}`
      );
    } catch (error) {
      setToastMessageProps({
        type: "error",
        open: true,
        title: "Erro ao gerar QR Code",
        description: "Tente novamente mais tarde",
        onOpenChange: (open) => {
          setToastMessageProps((prev) => ({ ...prev, open }));
        },
      });

      setLoading(false);
    }
  }

  return (
    <Toast.Provider swipeDirection="right">
      <ToastMessage
        type={toastMessageProps.type}
        open={toastMessageProps.open}
        description={toastMessageProps.description}
        onOpenChange={toastMessageProps.onOpenChange}
        title={toastMessageProps.title}
      />

      {loading && <LoadingSpinner />}

      <div className="bg-gray-50 pb-4 flex flex-col gap-4 w-full flex-1">
        <header className="flex flex-col w-full sticky top-0">
          <div className="w-full flex bg-[#002A72] items-center justify-center gap-2 p-1">
            <ShieldCheckIcon className="h-4 w-4" />

            <span className="text-[12px] font-body">Ambiente 100% seguro</span>
          </div>

          <div className="flex w-full bg-[#001F55] items-center justify-center p-4">
            <span className="font-bold font-title">
              Efetue seu pagamento abaixo
            </span>
          </div>
        </header>

        <div className="bg-gray-50 flex w-full justify-center">
          <h2 className="sr-only">Checkout</h2>

          <form
            className="max-w-3xl flex flex-col gap-6 w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col border border-gray-200 bg-white shadow-sm p-6 rounded">
              <div className="flex items-center gap-2">
                <div className="flex w-6 h-6 rounded-full bg-gray-700 items-center justify-center">
                  <span className="text-xs">1</span>
                </div>

                <h2 className="text-lg font-medium text-gray-900 font-title">
                  Dados Pessoais
                </h2>
              </div>

              <div className="mt-4 flex flex-col gap-6">
                <div className="flex flex-col">
                  <label
                    htmlFor="full-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nome completo
                  </label>

                  <div className="mt-1">
                    <input
                      type="text"
                      id="full-name"
                      {...register("fullName", {
                        required: "Campo obrigatório",
                      })}
                      autoComplete="given-name"
                      className={twMerge(
                        "text-gray-900 border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        `${errors.fullName ? "border-red-500" : ""}`
                      )}
                    />

                    {errors.fullName && (
                      <span className="text-red-500 text-sm">
                        {errors.fullName.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    E-mail
                  </label>

                  <div className="mt-1">
                    <input
                      type="text"
                      id="email"
                      {...register("email", {
                        required: "Campo obrigatório",
                      })}
                      autoComplete="email"
                      className={twMerge(
                        "text-gray-900 border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        `${errors.email ? "border-red-500" : ""}`
                      )}
                    />

                    {errors.email && (
                      <span className="text-red-500 text-sm">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="document"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CPF
                  </label>

                  <div className="mt-1">
                    <input
                      type="text"
                      id="document"
                      {...register("document", {
                        required: "Campo obrigatório",
                      })}
                      autoComplete="tel"
                      className={twMerge(
                        "text-gray-900 border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        `${errors.document ? "border-red-500" : ""}`
                      )}
                    />

                    {errors.document && (
                      <span className="text-red-500 text-sm">
                        {errors.document.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 flex-col border border-gray-200 bg-white shadow-sm p-6 rounded">
              <div className="flex items-center gap-2">
                <div className="flex w-6 h-6 rounded-full bg-gray-700 items-center justify-center">
                  <span className="text-xs">2</span>
                </div>

                <h2 className="text-lg font-medium text-gray-900 font-title">
                  Pagamento
                </h2>
              </div>

              <fieldset className="flex mt-4">
                <div className="flex w-full items-center justify-between gap-2 p-4 rounded border-[#001F55] border-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center p-[2px] rounded-full border border-gray-400">
                      <div className="w-3 h-3 bg-[#001F55] rounded-full"></div>
                    </div>

                    <span className="text-sm font-medium text-gray-900">
                      PIX
                    </span>
                  </div>

                  <QrCodeIcon className="h-4 w-4 text-gray-900" />
                </div>
              </fieldset>

              <div className="flex flex-col items-center mt-4 gap-2">
                <span className="text-gray-500 text-sm ">
                  Efetue o pagamento abaixo
                </span>

                <span className="text-gray-900 font-semibold text-sm">
                  R$77,11
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center w-full gap-4 p-6 md:p-0">
              <button
                type="submit"
                className="flex cursor-pointer rounded-md bg-[#001F55] gap-2 p-4 items-center justify-center text-white hover:bg-[#003772] transition-all"
              >
                <LockClosedIcon className="text-white h-4 w-4" /> Realizar
                Pagamento
              </button>

              <span className="text-[12px] text-center text-gray-900">
                Nós não compartilharemos seus dados com ninguém, você está em um
                ambiente seguro e apenas receberá emails referentes à sua
                compra. Você pode cancelar os recebimentos de emails a qualquer
                momento.
              </span>
            </div>
          </form>
        </div>
      </div>
    </Toast.Provider>
  );
}
