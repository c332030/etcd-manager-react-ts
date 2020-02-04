import React from "react";
import {Dialog, Notification, Upload} from "element-react";
import {EtcdNodeBo} from "../../../entity/bo/EtcdNodeBo";
import { debug } from "@c332030/common-utils-ts";
import {EtcdService} from "../../../service";
import {handleError} from "../../../util";
/**
 * Props 类型
 */
interface PropsType {
  visible: boolean

  hide: ()=>void
  reload: ()=>void

  loading: Function

  node?: EtcdNodeBo
}

export const ImportView: React.FC<PropsType> = (props) => {
  return (
    <>
      <Dialog
        title={'导入'}
        visible={ props.visible }
        size={'tiny'}
        closeOnClickModal={false}
        onCancel={ props.hide }
      >
        <Dialog.Body
          style={{
            textAlign: 'center'
          }}
        >
          <Upload
            // className="upload-demo"
            drag
            action=''
            showFileList={false}
            beforeUpload={(file) => {
              // debug('when select file');
              // debug(file);

              props.loading(true);

              const reader = new FileReader();
              reader.readAsText(file,'utf-8');

              // debug(reader);

              reader.onload = () => {

                const jsonStr = reader.result;
                // debug(jsonStr);

                try {

                  const url = props.node?.url;
                  if(!url) {
                    Notification.error('链接不存在');
                    return;
                  }

                  EtcdService.import(JSON.parse(jsonStr as string), url + '/').then(() => {
                    Notification.success('导入成功');
                  }).catch(handleError);

                } catch (e) {
                  Notification.error('读取文件数据失败！');
                } finally {
                  props.hide();
                  props.reload();
                  props.loading(false);
                }
              };

              return false;
            }}
          >
            <i className="el-icon-upload" />
            <div className="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </Upload>
        </Dialog.Body>

      </Dialog>
    </>
  );
};
