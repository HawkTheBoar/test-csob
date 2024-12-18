/**
 * Zde vytvořte formulář pomocí knihovny react-hook-form.
 * Formulář by měl splňovat:
 * 1) být validován yup schématem
 * 2) formulář obsahovat pole "NestedFields" z jiného souboru
 * 3) být plně TS typovaný
 * 4) nevalidní vstupy červeně označit (background/outline/border) a zobrazit u nich chybové hlášky
 * 5) nastavte výchozí hodnoty objektem initalValues
 * 6) mít "Submit" tlačítko, po jeho stisku se vylogují data z formuláře:  "console.log(formData)"
 *
 * V tomto souboru budou definovány pole:
 * amount - number; Validace min=0, max=300
 * damagedParts - string[] formou multi-checkboxu s volbami "roof", "front", "side", "rear"
 * vykresleny pole z form/NestedFields
 */

type MainFormData = {
  amount: number;
  allocation: number;
  damagedParts: string[];
  category: string;
  witnesses: {
    name: string;
    email: string;
  }[];
}
import yup from 'yup';
import { nested_schema } from './NestedFields';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import NestedFields from './NestedFields';
// příklad očekávaného výstupního JSON, předvyplňte tímto objektem formulář
export default function MainForm(){

  const schema = yup.object().shape({
    amount: yup.number().min(0).max(300),
    damagedParts: yup.array().of(yup.string().oneOf(damagedPartsOptions)),
    ...nested_schema.fields
  });

  const { control, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data: any) => { 
    console.log(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Amount
          <input {...control.register('amount')} />
        </label>
        <label>
          damagedParts
          <select>
            {damagedPartsOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <NestedFields />
      </form>
    </>
  );
}



const initialValues = {
  amount: 250,
  allocation: 140,
  damagedParts: ['side', 'rear'],
  category: 'kitchen-accessories',
  witnesses: [
    {
      name: 'Marek',
      email: 'marek@email.cz',
    },
    {
      name: 'Emily',
      email: 'emily.johnson@x.dummyjson.com',
    },
  ],
};

const damagedPartsOptions = ['roof', 'front', 'side', 'rear'];
