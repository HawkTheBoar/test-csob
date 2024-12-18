/**
 * Zde vytvořte formulářové vstupy pomocí react-hook-form, které:
 * 1) Budou součástí formuláře v MainForm, ale zůstanou v odděleném souboru
 * 2) Reference formuláře NEbude získána skrze Prop input (vyvarovat se "Prop drilling")
 * 3) Získá volby (options) pro pole "kategorie" z externího API: https://dummyjson.com/products/categories jako "value" bude "slug", jako "label" bude "name".
 *
 *
 * V tomto souboru budou definovány pole:
 * allocation - number; Bude disabled pokud není amount (z MainForm) vyplněno. Validace na min=0, max=[zadaná hodnota v amount]
 * category - string; Select input s volbami z API (label=name; value=slug)
 * witnesses - FieldArray - dynamické pole kdy lze tlačítkem přidat a odebrat dalšího svědka; Validace minimálně 1 svědek, max 5 svědků
 * witnesses.name - string; Validace required
 * witnesses.email - string; Validace e-mail a asynchronní validace, že email neexistuje na API https://dummyjson.com/users/search?q=[ZADANÝ EMAIL]  - tato validace by měla mít debounce 500ms
 */
import yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useEffect, useState } from 'react';

export const nested_schema = yup.object().shape({
    allocation: yup.number().min(0).max(300),
    category: yup.string(),
    witness: yup.array().of(yup.object().shape({
        name: yup.string().required(),
        email: yup.string().email().test('check-email', 'email exists', function (val) {
            return fetch(`https://dummyjson.com/users/search?q=${val}`, {method: 'GET'})
                .then(res => res.json())
                .then(data => {
                    return data.users.length === 0;
                })
        })
    })).max(5).min(1)

});

interface categoriesData{
    name: string;
    slug: string;
}
export default function NestedFields() {
    const { control } = useForm({
        resolver: yupResolver(nested_schema)
    });
    const [categories, setCategories] = useState([] as categoriesData[]);
    useEffect(() => {
        fetch('https://dummyjson.com/products/categories')
            .then(res => res.json())
            .then(data => {
                setCategories(data);
            })
    })
    return (
    <>
        <label>
            Category
            <select {...control.register('category')} name='category'>
                {
                    categories.map(category => (
                        <option key={category.slug} value={category.slug}>
                            {category.name}
                        </option>
                    ))
                }
            </select>
        </label>
        <input {...control.register('allocation')} name='allocation'>
        
        </input>
            
    </>
    
);

}