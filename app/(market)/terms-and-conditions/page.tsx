import { Metadata } from 'next';
import { PageTitle, PageBody } from '../../components/PageMain';

export const metadata: Metadata = {
    title: "Terms and Conditions | First Sip Matcha Bar",
    description: "Use of this site constitutes acceptance of these terms.",
};

export default function PrivacyPage(){
    return(<div id="page" className="page">
        <PageTitle title_text="Terms and Conditions"/>
        <PageBody>
            <section id="section-1" className="section">
                <div className="section-heading"><h2></h2></div>
                <div className="section-body">
                    <p>To be added...</p>
                </div>
            </section>
        </PageBody>
    </div>);
}