import { useFormStatus } from 'react-dom';

type Params = {
    text: string,
    pendingText?: string,
    props?: object,
    localPending?: boolean,
}

export default function SubmitButton({ text, pendingText, props, localPending = false }: Params){
    const { pending } = useFormStatus();

    return(<button
        className={`${localPending ? 'btn-secondary' : 'btn-primary'}`}
        type='submit'
        disabled={pending || localPending}
        {...props}
    >
        {(pending || localPending) && pendingText ? pendingText : text}
    </button>);
}