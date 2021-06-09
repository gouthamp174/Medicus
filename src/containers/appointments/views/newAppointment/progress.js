import React from 'react';
import { useExtendClass } from '../../../../components/hooks';


export default function ProgressBar(props) {
    const { value, minValue, maxValue } = props;
    const className = useExtendClass("progress md-nw-appt-pgbar", props.className);

    var widthRatio = 0;
    if (value && maxValue) {
        widthRatio = (value / maxValue) * 100;
    }

    return (
        <div class={className}>
            <div class="progress-bar" role="progressbar" style={{width: `${widthRatio}%`}}
                aria-valuenow={`${value}`} aria-valuemin={`${minValue}`} aria-valuemax={`${maxValue}`}>
            </div>
        </div>
    );
}