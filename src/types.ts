export interface VehicleData {
  placa: string;
  motorista: string;
  inspetor: string;
  marca: string;
  modelo: string;
  data: string;
}

export interface InspectionItem {
  id: string;
  status: 'conforme' | 'nao_conforme' | 'na' | null;
  observacao: string;
}

export interface DetailedInspectionItem {
  id: string;
  status: 'conforme' | 'nao_conforme' | 'na' | null;
  observacao: string;
  fotos: File[];
}

export interface ChecklistData {
  veiculo: VehicleData;
  inspecoes: { [key: string]: InspectionItem };
  inspecoesDetalhadas: { [key: string]: DetailedInspectionItem };
  id: string;
  createdAt: string;
}