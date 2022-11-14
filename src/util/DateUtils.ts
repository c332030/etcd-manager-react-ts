/**
 * <p>
 *   Description: DateUtils
 * </p>
 * @author c332030
 * @version 1.0
 * @date 2020-2-3 17:06
 */
export class DateUtils {

  /**
   * 日期格式化
   * @param date
   */
  public static DateFormat(date: Date): string{
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  /**
   * 时间格式化
   * @param date
   */
  public static TimeFormat(date: Date): string{
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }

  /**
   * 日期时间格式化
   * @param date
   */
  public static DateTimeFormat(date: Date): string{
    return `${this.DateFormat(date)} ${this.TimeFormat(date)}`;
  }
}
