import { Metadata } from 'next';
import { PageTitle, PageBody } from '../../components/PageMain';

export const metadata: Metadata = {
    title: "Privacy Policy | First Sip Matcha Bar",
    description: "At First Sip Matcha Bar, we respect your privacy and are committed to protecting it.",
};

export default function PrivacyPage(){
    return(<div id="page" className="page">
            <PageTitle title_text="Privacy Policy"/>

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