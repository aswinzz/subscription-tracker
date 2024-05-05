import { ITEM } from '@/lib/types';
import { deleteItem, setData } from '@/lib/utils';
import { useState } from 'react';
import { createSupabaseClient } from '@/utils/supabase/server'

interface FormData {
    id: number,
    serviceName: string,
    amount: number,
    currency: string,
    cycle: string,
    billingDate: string,
    notes: string,
    website: string,
    logo: string,
}

interface FormActions {
  save: (update?: boolean) => void;
  delete: () => void;
  update: (key: string, value: string) => void;
}

const initialState = {
    id: -1,
    serviceName: '',
    amount: 0,
    currency: '',
    cycle: '',
    billingDate: '',
    notes: '',
    website: '',
    logo: '',
};

const useForm = (data?: ITEM): [FormData, FormActions] => {
  const existingData = data as FormData;
  const [formData, setFormData] = useState<FormData>(existingData || initialState);
  const supabase = createSupabaseClient();

  const save = async (update = false) => {
    await setData({
        ...formData,
        id: update ? formData.id : -1, // for creation we pass id as -1, it will be generated in the util
    }, supabase);
  };

  const deleteData = () => {
    deleteItem(formData.id, supabase);
  };

  const update = (key: string, value: string | number) => {
    console.log(key, value, formData);
    setFormData({
        ...formData,
        [key]: value,
    });
  }

  const formActions: FormActions = {
    save,
    delete: deleteData,
    update,
  };

  return [formData, formActions];
};

export default useForm;