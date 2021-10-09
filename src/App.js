import Side from "./side";
import React, { useState } from "react";

export function App(props){
    const [sides, setSides] = useState(props.sides);
    const onAddSide = () => {

        setSides(oldArray => [...oldArray, null]);
    }

    return (
         sides.map(side => {
            return <Side onSave={props.onSave} data={side.data} image={side.image} onAddSide={onAddSide}/>;
        })

    )
}
