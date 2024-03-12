import React from "react";

type Props = {
    params: any;
}

export default function route({ params }: Props) {
    return <div>Route Id: {params.id}</div>
}