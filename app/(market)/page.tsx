import Image from 'next/image';
import Link from 'next/link';
import HeroBanner from './components/HeroBanner';
import Figure from '@/app/components/Figure';

import img_showcase from './images/misc/matcha-latte-transparent.png';
import img_ex from './images/misc/example.jpg';
import about_info from '../../database/aboutpage.json';

export default function HomePage(){
    return(<>
        <div id="hero" className="landing-container">
            <HeroBanner />
        </div>

        <div id="showcase" className="landing-container">
            <div className="showcase-item-container">
                <section className="showcase-item landing">
                    <Figure className="container-1">
                        <Image
                            src={img_showcase}
                            alt="A glass of the signature Matcha Latte, served with ice."
                            priority={true}
                        />
                    </Figure>
                    <div className="container-2">
                        <div className="info">
                            <h2 className="title">
                                <span className="title-1">Our signature</span> 
                                <span className="title-2">MATCHA LATTE</span>
                            </h2>
                            <div className="description">Smooth and creamy, made with high-quality blend from Uji, Japan</div>
                        </div>
                        <div className="add">
                            <h3 className="heading">AVAILABLE WITH</h3>
                            <div className="list">
                                <div className="item" id="ice">
                                    <i aria-hidden={true} className="fa fa-solid fa-snowflake"></i>
                                    <span className="label">Ice</span>
                                </div>
                                <div className="item" id="foam">
                                    <i aria-hidden={true} className="fa fa-solid fa-cloud"></i>
                                    <span className="label">Cold Foam</span>
                                </div>
                                <div className="item" id="syrup">
                                    <i aria-hidden={true} className="fa fa-solid fa-droplet"></i>
                                    <span className="label">Fruit Syrup</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="showcase-link-container">
                <section className="showcase-link landing">
                    <div className="container-1">
                        <div className="info">
                            <h2 className="title">
                                <span className="title-1">Browse </span>
                                <span className="title-2">OUR FULL MENU</span>
                            </h2>
                            <Link className="btn-primary" href="/menu">Explore all drinks</Link>
                        </div>
                    </div>
                    <Figure className="container-2">
                        <Image
                            src={img_ex}
                            alt=''
                            // alt="A hand holding the signature Matcha Latte, served with ice, by the top of the plastic cup along with a straw. In the background, there are plotted plants with large green leaves."
                            role="presentation"
                        />
                    </Figure>
                </section>
            </div>
        </div>

        <div id="about" className="landing-container">
            <section className="landing">
                <Figure className="container-1">
                    <svg focusable={false} aria-hidden={true} viewBox="0 0 387 466" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M73.8394 0L44.9533 55.2268L65.0372 66.7377L279.266 84.1982L314.847 54.4507L274.927 61.3056L292.655 14.8737L73.8394 0ZM314.723 17.5898L341.749 52.8987L329.476 185.986L332.947 341.319L387 397.322L371.999 331.102L378.818 185.081L347.452 43.1985L314.723 17.5898ZM313.235 78.5074L270.34 116.532L69.0044 97.5199L27.7208 154.687L11.1081 315.84L225.833 352.184L9.02537 336.146L0 423.707L242.073 458.24L252.983 178.226L313.235 78.5074ZM320.797 102.823L274.679 185.986L266.992 426.423L311.499 348.045L311.871 185.986L320.797 102.823ZM325.261 362.919L266.992 466L382.041 426.423L325.261 362.919Z" fill="#66A792"/>
                    </svg>
                    {about_info.benefits.map((item, i: number) => (
                        <div key={i} id={item.id} className="card">
                            <i aria-hidden={true} className={item.icon_className}></i>
                            <span className="label">{item.label}</span>
                        </div>
                    ))}
                </Figure>
                <div className="container-2">
                    <div className="info">
                        <h2 className="title">
                            <span className="title-2">WHY MATCHA?</span>
                        </h2>
                        <Link
                            // aria-label='Learn more about us and our ceremonial matcha'
                            className="btn-secondary"
                            href="/about"
                        >
                            Learn more
                            <span className='sr-only'> about us and our ceremonial matcha</span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    </>);
}