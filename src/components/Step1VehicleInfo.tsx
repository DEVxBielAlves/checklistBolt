import React, { useState, useEffect } from 'react';
import { VehicleData } from '../types';

interface Step1Props {
  data: VehicleData;
  onUpdate: (data: VehicleData) => void;
  onNext: () => void;
}

export const Step1VehicleInfo: React.FC<Step1Props> = ({ data, onUpdate, onNext }) => {
  const [formData, setFormData] = useState<VehicleData>(data);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Set automatic date/time
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    setFormData(prev => ({ ...prev, data: formattedDate }));
  }, []);

  const validatePlaca = (placa: string): boolean => {
    const oldFormat = /^[A-Z]{3}-\d{4}$/;
    const newFormat = /^[A-Z]{3}\d{4}$/;
    return oldFormat.test(placa) || newFormat.test(placa);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.placa.trim()) {
      newErrors.placa = 'Placa é obrigatória';
    } else if (!validatePlaca(formData.placa.toUpperCase())) {
      newErrors.placa = 'Formato inválido (AAA-0000 ou ABC1234)';
    }

    if (!formData.motorista.trim()) {
      newErrors.motorista = 'Nome do motorista é obrigatório';
    }

    if (!formData.inspetor.trim()) {
      newErrors.inspetor = 'Nome do inspetor é obrigatório';
    }

    if (!formData.marca) {
      newErrors.marca = 'Marca é obrigatória';
    }

    if (!formData.modelo) {
      newErrors.modelo = 'Modelo é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onUpdate(formData);
      onNext();
    }
  };

  const handleInputChange = (field: keyof VehicleData, value: string) => {
    if (field === 'placa') {
      value = value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Dados do Veículo</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Placa do Veículo
            </label>
            <input
              type="text"
              value={formData.placa}
              onChange={(e) => handleInputChange('placa', e.target.value)}
              placeholder="AAA-0000 ou ABC1234"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.placa ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={8}
            />
            {errors.placa && <p className="text-red-500 text-sm mt-1">{errors.placa}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Motorista
            </label>
            <input
              type="text"
              value={formData.motorista}
              onChange={(e) => handleInputChange('motorista', e.target.value)}
              placeholder="Digite o nome do motorista"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.motorista ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.motorista && <p className="text-red-500 text-sm mt-1">{errors.motorista}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inspetor
            </label>
            <input
              type="text"
              value={formData.inspetor}
              onChange={(e) => handleInputChange('inspetor', e.target.value)}
              placeholder="Digite o nome do inspetor"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.inspetor ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.inspetor && <p className="text-red-500 text-sm mt-1">{errors.inspetor}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marca do Veículo
            </label>
            <select
              value={formData.marca}
              onChange={(e) => handleInputChange('marca', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.marca ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione a marca</option>
              <option value="SC">SC (Scania)</option>
              <option value="MBB">MBB (Mercedes)</option>
              <option value="VW">VW (Volkswagen)</option>
              <option value="IV">IV (Iveco)</option>
            </select>
            {errors.marca && <p className="text-red-500 text-sm mt-1">{errors.marca}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modelo
            </label>
            <select
              value={formData.modelo}
              onChange={(e) => handleInputChange('modelo', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.modelo ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione o modelo</option>
              <option value="Truck">Truck</option>
              <option value="Carreta">Carreta</option>
            </select>
            {errors.modelo && <p className="text-red-500 text-sm mt-1">{errors.modelo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data e Hora
            </label>
            <input
              type="text"
              value={formData.data}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-4 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-lg"
      >
        Próximo
      </button>
    </div>
  );
};