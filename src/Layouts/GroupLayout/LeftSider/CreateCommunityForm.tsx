import React, { useState } from "react";
import { Button, Form, Input, Modal, Radio, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CommunityService from "../../../services/communityService";
import { CrCommunityForm, Privacy } from "../../../utils/type";

const CreateCommunityForm: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const handleSubmit = async (values: { name: string; privacy: Privacy }) => {
    setLoading(true);
    try {
      const newCommunity:CrCommunityForm={
        coverPhoto:"https://external.fhan2-4.fna.fbcdn.net/emg1/v/t13/16952075937963750748?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FPqRrvohcyz4%2Fmaxresdefault.jpg&fb_obo=1&utld=ytimg.com&stp=c0.5000x0.5000f_dst-jpg_flffffff_p500x261_q75_tt6&_nc_gid=ICKYfJDQlHBbCVVftUdr1w&_nc_eui2=AeGcxJv_iFGTnrhsuELNYXqEY74APbD0hlFjvgA9sPSGUYIsvC3_wo6pUP_G_HeqAj7ZpkqWTTFOJXNfbZt2_fC_&_nc_oc=AdlRZv31sajiU_uYRbHrwZB5Mul5Jf-WqbP8RiDKhsNK47SqdP1-hAqN1YipR0BXBw0&ccb=13-1&oh=06_Q3-yAfzw50XzNfR1xfDGUm6-ECW7dRE02hayOwonhWAd3JEd&oe=6802EAD4&_nc_sid=c63717",
        communityName:values.name,
        privacy:values.privacy,
      }
      await CommunityService.create(newCommunity);
      
      message.success("Nhóm đã được tạo thành công!");
      setVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại!"+ error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>
        Tạo nhóm mới
      </Button>
      <Modal
        title="Tạo nhóm mới"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Tên nhóm"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên nhóm!" }]}
          >
            <Input placeholder="Nhập tên nhóm" />
          </Form.Item>

          <Form.Item label="Chế độ nhóm" name="privacy" initialValue="public">
            <Radio.Group>
              <Radio value="public">Công khai</Radio>
              <Radio value="private">Riêng tư</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: "100%" }}>
              Tạo nhóm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateCommunityForm;
