export type PixGenerationResponse = {
  qrcode: {
    content: string;
    reference_code: string;
  };
};

export type PixInfo = {
    qrcode: {
        reference_code: string,
        external_reference: null | string,
        value_cents: number,
        content: string,
        status: string,
        generator_name: string,
        generator_document: string,
        payer_name: null | string,
        payer_document: null | string,
        payer_bank_name: null | string,
        payer_agency: null | string,
        payer_account: null | string,
        payer_account_type: null | string,
        registration_date: Date,
        payment_date: null | Date,
        end_to_end: null
    }
}
