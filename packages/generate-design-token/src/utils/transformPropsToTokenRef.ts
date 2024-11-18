const transformPropsToTokenRef = (props: string[]) => {
    return props.join(".");
}

export default transformPropsToTokenRef