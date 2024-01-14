import { Alert, Spin } from "antd";
import { lazy, Suspense } from "react";

const lazyFn = (importFn: any) => {
    const LazyComponent = lazy(importFn)
    const loading =
            <Spin size="large" fullscreen style={{backgroundColor:"rgba(128, 128, 128, 0.627)"}} tip="Loading..." ></Spin>
    return () => (
        <Suspense fallback={loading}>
            <LazyComponent />
        </Suspense>
    );
};

export default lazyFn;