import React from 'react';

type Props = React.HTMLAttributes<HTMLElement> & {
    isNegative?: boolean
    'data-testid'?: string
}

const Spinner: React.FC<Props> = (props: Props) => {
    return (
        <div
            {...props}
            data-testid="spinner"
            className="col s2 offset-s5 center"
        >
            <div className="preloader-wrapper big active">
                <div className="spinner-layer spinner-blue-only">
                    <div className="circle-clipper left">
                        <div className="circle" />
                    </div>
                    <div className="gap-patch">
                        <div className="circle" />
                    </div>
                    <div className="circle-clipper right">
                        <div className="circle" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Spinner