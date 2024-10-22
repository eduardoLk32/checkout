"use client";

import { PixInfo } from "@/types/pix";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import * as Toast from "@radix-ui/react-toast";
import { useParams, useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import ToastMessage, { ToastMessageProps } from "../../components/toast";

export default function PixTransaction() {
  const searchParams = useSearchParams();

  const [paid, setPaid] = useState(false);
  const { payload } = useParams<{ payload: string }>();

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
  const userName = searchParams.get("userName");
  const userEmail = searchParams.get("userEmail");
  const pixReference = searchParams.get("pixReference");

  useEffect(() => {
    const interval = setInterval(() => {
      if (paid) {
        clearInterval(interval);
      }
      checkPayment();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  function copyQrCode() {
    navigator.clipboard.writeText(payload);

    setToastMessageProps({
      type: "success",
      open: true,
      title: "Código copiado",
      description:
        "O código do QR Code foi copiado para a área de transferência",
      onOpenChange: (open) => {
        setToastMessageProps((prev) => ({ ...prev, open }));
      },
    } as ToastMessageProps);
  }

  async function checkPayment() {
    const paymentResponse = await fetch(`/api/pix-payment/${pixReference}`, {
      method: "GET",
      next: {
        revalidate: 0,
      },
    });

    const { qrcode }: PixInfo = await paymentResponse.json();

    if (qrcode.status === "paid") {
      setPaid(true);
      setToastMessageProps({
        type: "success",
        open: true,
        title: "Pagamento efetuado!",
        description: "O pagamento foi efetuado com sucesso",
        onOpenChange: (open) => {
          setToastMessageProps((prev) => ({ ...prev, open }));
        },
      });
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

      <div className="text-black bg-gray-50 px-6 py-4 min-h-screen flex flex-col items-center justify-center w-full flex-1">
        <div className="flex gap-6 flex-col w-full max-w-[500px]">
          <h1 className="text-[#002a72] font-bold font-title text-center text-2xl">
            Finalize seu pagamento de R$ 77,11
            <br />
            Efetue seu pagamento abaixo:
          </h1>

          <section className="border border-gray-300 border-t-0 rounded-2xl rounded-b-md">
            <div className="flex flex-col w-full items-center justify-center bg-[#002a72] gap-6 rounded-2xl p-8">
              <div className="flex flex-col gap-2">
                <span className="text-white font-bold font-title text-center text-lg">
                  Pague por PIX utilizando o QR Code
                </span>

                <span className="text-gray-200 font-body text-[12px] text-center">
                  Abra o app em que vai fazer a transferência, escaneie a imagem
                  ou cole o código do QR Code
                </span>
              </div>

              <div className="flex bg-white p-3">
                <QRCodeSVG width={160} height={160} value={payload} />
              </div>

              <div className="flex w-full items-center justify-center">
                <span className="text-white font-bold font-title text-center text-xl">
                  R$ 77,11
                </span>
              </div>

              <button
                onClick={copyQrCode}
                className="bg-gray-100 cursor-pointer w-full flex gap-2 items-center justify-center rounded-xl p-4 text-[#002a72] hover:bg-gray-300"
              >
                <span
                  className={twMerge(
                    "text-[#002a72] font-body font-semibold text-sm"
                  )}
                >
                  Copiar código do QR Code
                </span>
                <ClipboardDocumentIcon
                  className={twMerge(
                    "w-6 h-6 ",
                    `${
                      toastMessageProps.open
                        ? "text-green-700"
                        : "text-[#002a72]"
                    }`
                  )}
                />
              </button>

              <span className="text-white font-title text-sm cursor-pointer">
                Realizou seu pagamento?
                <span
                  onClick={checkPayment}
                  className="font-semibold"
                >{` Clique aqui`}</span>
              </span>
            </div>

            <div className="flex flex-col gap-2 p-2 px-4">
              <div className="flex flex-col w-full items-center p-4 border-b border-b-gray-300">
                <span className="text-gray-900 font-title font-semibold">
                  Efetue o pagamento abaixo
                </span>

                <span className="text-gray-900 font-title font-semibold">
                  R$ 77,11
                </span>
              </div>

              <div className="flex flex-col w-full gap-2 items-center pt-4 pb-5">
                <span className="text-gray-900 font-title font-semibold">
                  Dados do cliente
                </span>

                <div className="flex flex-col items-center">
                  <span className="text-gray-700 text-sm font-body">
                    {userName}
                  </span>
                  <span className="text-gray-700 text-sm font-body">
                    {userEmail}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Toast.Provider>
  );
}
