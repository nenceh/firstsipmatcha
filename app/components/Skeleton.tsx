const Skeleton = ({ classes, children }: { classes?: string, children?: React.ReactNode }) => {
    return <div
        className={`skeleton animate-pulse ${classes ? classes : ``}`}
    >
        {children}
    </div>
}

export default Skeleton;