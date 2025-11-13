// Custom Figure component with an option to include a figcaption (usually used with an image)
export default function Figure({
    children,
    className,
    figcaption,
}: Readonly<{
    children: React.ReactNode,
    className?: string,
    figcaption?: string;
}>) {
    return (<figure className={className}>
        {children}
        {figcaption === undefined ?
            <></>
        :
            <figcaption>{figcaption}</figcaption>
        }
    </figure>);
}