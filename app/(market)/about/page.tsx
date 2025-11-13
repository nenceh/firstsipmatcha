import Image from 'next/image';
import { Metadata } from 'next';
import { PageTitle, PageBody } from '@/app/components/PageMain';
import Figure from '@/app/components/Figure';

import DropdownToggle from './components/DropdownToggle';

import about_info from '../../../database/aboutpage.json';
import fsm_about from './images/02-08-25.jpg';

export const metadata: Metadata = {
    title: "About Us | First Sip Matcha Bar",
    description: "Read about us, First Sip Matcha Bar, and learn about our ceremonial matcha!",
};

export default function AboutPage(){
    return(<div id="about" className="page">
        <PageTitle title_text="About Us"/>

        <PageBody>
            <section id="section-1" className="section">
                <div className="section-heading"><h2>First Sip Matcha Bar</h2></div>
                <div className="section-body">
                    <p>Our ceremonial matcha is sourced from <i>Uji, Japan</i>—famous for its ideal climate and growing conditions. Guarantee authentic, top-quality green tea with every sip!</p>

                    <Figure className = {"graphic"} figcaption={"📅 Feb. 8, 2025 - Valentine's Market"}>
                        <Image
                            src={fsm_about}
                            alt="An image of our lovely founder working at one of our pop-up shops!"
                            priority={true}
                        />
                    </Figure>
                    
                    <p>Just a bored 24 year old living at home and drinks matcha everyday so she decided to make a business out of it to escape working in academics and become filthy rich.</p>
                </div>
            </section>

            <section id="section-2" className="section">
                <div className="section-heading"><h2>All about matcha</h2></div>
                <div className="section-body">
                    <p>Matcha is a powdered form of Japanese green tea produced from specially grown and processed Camellia sinensis leaves.</p>
                    <p>It is made through 3 separate stages:</p>
                    <ol className="stages-container restrict">
                        {about_info.stages.map((stage: AboutInfo, i: number) => (
                            <li className="stage bullet" key={i}>
                                <h3 className="label">{stage.label}</h3>
                                <div className="description">{stage.description}</div>
                            </li>
                        ))}
                    </ol>

                    <p>Here are some of the benefits of matcha:</p>
                    <ul className="benefits-container">
                        {about_info.benefits.map((benefit: AboutInfo, i: number) => (
                            <li className="benefit" id={benefit.id} key={i}>
                                <h3
                                    // tabIndex={-1}
                                >
                                    <DropdownToggle
                                        benefitId={benefit.id}
                                        benefitIconClassName={benefit.icon_className}
                                        benefitLabel={benefit.label}
                                    />
                                </h3>
                                <div className="description" id={`${benefit.id}-description`} aria-labelledby={`${benefit.id}-toggle`}>{benefit.description}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </PageBody>
    </div>);
}