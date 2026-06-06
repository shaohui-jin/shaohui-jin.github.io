import type { Emitter } from "mitt";
import mitt from "mitt";

type Events = {
  resize: {
    detail: {
      width: number;
      height: number;
    };
  };
  openPanel: string;
  tagViewsChange: string;
  tagViewsShowModel: string;
  logoChange: boolean;
  changLayoutRoute: {
    indexPath: string;
    parentPath: string;
  };
  // 页签关闭相关事件
  tabCloseCheck: {
    name: string;
    resolve: (shouldClose: boolean) => void;
  };
  tabCloseResponse: {
    path: string;
    shouldClose: boolean;
  };
};

export const emitter: Emitter<Events> = mitt<Events>();
