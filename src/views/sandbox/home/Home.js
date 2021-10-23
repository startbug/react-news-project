import React from "react";
import axios from "axios";
import { Button } from "antd";

export default function Home() {
  const ajax = () => {
    // axios.get("http://localhost:8000/posts").then((res) => {
    //   console.log(res);
    // });

    // axios
    //   .post("http://localhost:8000/posts", {
    //     title: "吃饭了吗",
    //     author: "小明",
    //   })
    //   .then((res) => {
    //     console.log(res);
    //   });

    //覆盖更新
    // axios
    //   .put("http://localhost:8000/posts/1", {
    //     title: "你牛逼",
    //   })
    //   .then((res) => {
    //     console.log(res);
    //   });

    //_embed 关联查询
    // axios.get("http://localhost:8000/posts?_embed=comments").then((res) => {
    //   console.log(res);
    // });

    //_expand 关联查询
    // axios.get("http://localhost:8000/comments?_expand=post").then((res) => {
    //   console.log(res);
    // });
  };
  return (
    <div>
      <Button type="primary" onClick={ajax}>
        点击
      </Button>
    </div>
  );
}
