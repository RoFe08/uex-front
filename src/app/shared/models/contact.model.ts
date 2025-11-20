export interface Contact {
    id?: number;
    name: string;
    cpf: string;
    phone: string;
    cep: string;
    street: string;
    number: string;
    complement?: string | null;
    neighborhood: string;
    city: string;
    state: string;
    latitude?: number | null;
    longitude?: number | null;
  }
  