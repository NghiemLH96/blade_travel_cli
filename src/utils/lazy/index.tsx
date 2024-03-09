import { Spin } from "antd";
import { lazy, Suspense } from "react";

const lazyFn = (importFn: any ,access : boolean) => {

    if (!access) {
        return () =>(
            <>Không có quyền truy cập</>
        )
    }

      const LazyComponent = lazy(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(importFn());
          }, 1000);
        });
      });
    const loading =
            <Spin size="large" fullscreen style={{backgroundColor:"rgba(128, 128, 128, 0.627)"}} ></Spin>
    return () => (
        <Suspense fallback={loading}>
            <LazyComponent />
        </Suspense>
    );
};   


export default lazyFn;