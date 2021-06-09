import { useMediaQuery } from 'react-responsive';


export function XsDevice(props) {
    const isXsDevice = useMediaQuery({ maxWidth: 575 });
    return isXsDevice ? props.children : null;
}

export function SmDevice(props) {
    const isSmDevice = useMediaQuery({ minWidth: 576, maxWidth: 767 });
    return isSmDevice ? props.children : null;
}

export function MdDevice(props) {
    const isMdDevice = useMediaQuery({ minWidth: 768, maxWidth: 991 });
    return isMdDevice ? props.children : null;
}

export function LgDevice(props) {
    const isLgDevice = useMediaQuery({ minWidth: 992, maxWidth: 1199 });
    return isLgDevice ? props.children : null;
}

export function XlDevice(props) {
    const isXlDevice = useMediaQuery({ minWidth: 1200 });
    return isXlDevice ? props.children : null;
}
