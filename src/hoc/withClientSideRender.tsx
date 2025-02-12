import { type ComponentType, useEffect, useState } from "react";

const withClientSideRender = <P extends object>(
  WrappedComponent: ComponentType<P>,
) => {
  const ClientSideComponent = (props: P) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return <WrappedComponent {...props} />;
  };

  return ClientSideComponent;
};

export default withClientSideRender;
