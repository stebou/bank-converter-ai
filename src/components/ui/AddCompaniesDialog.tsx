'use client';

import { Building2, Plus } from 'lucide-react';
import React from 'react';

interface AddCompaniesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCompanies: () => void;
  listName: string;
}

export const AddCompaniesDialog: React.FC<AddCompaniesDialogProps> = ({
  isOpen,
  onClose,
  onAddCompanies,
  listName,
}) => {
  if (!isOpen) return null;

  const handleAddCompanies = () => {
    onAddCompanies();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Dialog */}
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="sm:flex sm:items-start">
            {/* Icon */}
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>

            {/* Content */}
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Liste créée avec succès !
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  La liste{' '}
                  <span className="font-medium text-gray-900">
                    "{listName}"
                  </span>{' '}
                  a été créée. Voulez-vous ajouter des entreprises maintenant ?
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
              onClick={handleAddCompanies}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter des entreprises
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              onClick={onClose}
            >
              Plus tard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
