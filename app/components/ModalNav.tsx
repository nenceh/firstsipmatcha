import { MainNav, SocialNav } from "./MainNav";

export default function ModalNav({
    open, // if modal is open
    top, // value of offset from top of page in pixels
    vw, // value of the view width in pixels
    pathname, // the current pathname
}: Readonly<{
    open: boolean,
    top: number | undefined,
    vw: number;
    pathname: string,
}>) {
    return (
        <div
            className={`modal-container${open ? ' open' : ''}`}
            {...vw >= 713 && {'aria-hidden':true}}
            style={{
                'top' : top
            }}
            aria-modal={true}
            id={`primary-hamburger-nav-menu`}
        >
            <nav className="menu-modal">
                <MainNav
                    classname={'btn-menuitem'}
                    modal={true}
                    pathname={pathname}
                />
                <SocialNav />
            </nav>
        </div>
    );
}