
/**
 * <p>
 *   Description: FileUtils
 * </p>
 * @author c332030
 * @version 1.0
 * @date 2020-2-1 14:51
 */
export class FileUtils {

  public static str2txt(str: string, name?: string) {

    if(!str) {
      throw new Error('Empty string');
    }

    const blob = new Blob([str]);

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name ? name : `${new Date().getTime()}.txt`;

    document.body.append(a);

    const aEvent = document.createEvent('MouseEvents');
    aEvent.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(aEvent);

    a.remove();
  }
}
