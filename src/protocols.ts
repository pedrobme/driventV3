export type ApplicationError = {
  name: string;
  message: string;
};

export type ViaCEPAddress = {
  logradouro: string,
  complemento: string,
  bairro: string,
  localidade: string,
  uf: string,

};

//Regra de Negócio
export type AddressEnrollment = {
  logradouro: string,
  complemento: string,
  bairro: string,
  cidade: string,
  uf: string,
  error?: string

}

export type RequestError = {
  status: number,
  data: object | null,
  statusText: string,
  name: string,
  message: string,
};

export type HotelWithRooms = {
  id: string,
  name: string,
  image: string,
  createdAt: string,
  updatedAt: string,
  Rooms: [
    {
      id: string,
      name: string,
      capacity: number,
      hotelId: string,
      createdAt: string,
      updatedAt: string,
    }
  ];
}

export type Hotel = {
  id: string,
  name: string,
  image: string,
  createdAt: string,
  updatedAt: string
}