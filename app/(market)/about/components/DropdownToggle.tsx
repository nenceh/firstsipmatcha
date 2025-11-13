"use client";

import { useState } from "react";

type Params = {
    benefitId?: string,
    benefitIconClassName?: string,
    benefitLabel: string,
}

export default function DropdownToggle ({ benefitId, benefitIconClassName, benefitLabel }: Params) {
    const [visible, toggleVisible] = useState(false);
    
    const toggleBenefit = (benefitId: string | undefined) => {
        document.getElementById(benefitId || '')?.classList.toggle('open');

        toggleVisible(!visible);
    }

    return (<button
        className="btn-secondary benefit-toggle"
        onClick={() => toggleBenefit(benefitId)}
        aria-controls={`${benefitId}-description`}
        // aria-label={`${visible ? `Collapse ${benefitId}-description` : `Reveal ${benefitId}-description`}`}
        aria-expanded={visible ? true : false}
        id={`${benefitId}-toggle`}
    >
        <span className="icon" aria-hidden={true}>
            <i className={benefitIconClassName}/>
        </span>

        <span className="label">{benefitLabel}</span>
        
        <span className="ctrl icon" aria-hidden={true}>
            <i className="fa fa-solid fa-chevron-right"></i>
        </span>
    </button>);
}