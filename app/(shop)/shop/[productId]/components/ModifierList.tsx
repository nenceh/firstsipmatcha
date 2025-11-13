import { ChangeEvent } from "react";

type Params = {
    listIdx: number,
    modifierList: {
        name: string,
        list: {
            default: boolean,
            name: string,
            id: string,
        }[],
    },
    selectModifier: (listIdx: number, modIdx: number) => void,
}

export default function ModifierList({ listIdx, modifierList, selectModifier }: Params) {
    const modId = modifierList.name.toLowerCase().replaceAll(' ','-');
    return (<div
        className="modifier-list"
    >
        <label htmlFor={`${modId}-options`} className="modifier-list-label">{modifierList.name}</label>
        <select
            id={`${modId}-options`}
            form='add-cart'
            name={modId}
            aria-label={modifierList.name}
            onChange={(e: ChangeEvent) => selectModifier(listIdx, (e.target as HTMLSelectElement).selectedIndex - 1)}
        >
            <option disabled>{modifierList.name}</option>
            {modifierList.list.map((modifier, i) => (
                <option aria-label={modifier.name} key={i}>{modifier.name}</option>
            ))}
        </select>
        <span aria-hidden={true} className="picker-icon"><i aria-hidden={true} className="fa fa-solid fa-chevron-down"></i></span>
    </div>);
}