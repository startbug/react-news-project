import NewsPublish from "../../../components/publish-manage/NewsPublish";
import usePublish from "../../../components/publish-manage/usePublish";
import { Button } from "antd";

/**
 * 已下架
 */
export default function Published() {
  const { dataSource, handleSunset } = usePublish(3);

  return (
    <div>
      <NewsPublish
        dataSource={dataSource}
        button={(id) => (
          <Button type="primary" danger onClick={() => handleSunset(id)}>
            删除
          </Button>
        )}
      ></NewsPublish>
    </div>
  );
}
