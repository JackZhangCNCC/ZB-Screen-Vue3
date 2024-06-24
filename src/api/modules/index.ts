import { GET, POST, FILE, FILEPOST, PUT, GETNOBASE } from "../api";
const indexUrl = {
  jclcypgk:     "/ygtbi_ypjg_jclcypgk",     // 药品监管_基层临床药品概况
  jbywyyfx:     "/ygtbi_ypjg_jbyw",         // 药品监管_基本药物应用分析
  ssytzbqk:     "/ygtbi_ypjg_ssytzb",       // 药品监管_三素一汤占比情况
  ypxhqkpm:     "/ygtbi_ypjg_ypxh",         // 药品监管_药品消耗情况排名
  kjypfx:       "/ygtbi_ypjg_kjyw",         // 药品监管_抗菌药品分析

  qynzcrc:      "/ygtbi_fjzl_qynzcrc",      // 分级诊疗_医域内转出人次Top5
  qywzwjg:      "/ygtbi_fjzl_qywzwjg",      // 分级诊疗_医域外转往机构Top5
  mnzzsj:       "/ygtbi_fjzl_mnzzsj",       // 分级诊疗_每年转诊数据
  byzz:         "/ygtbi_fjzl_byzz",         // 分级诊疗_本月转诊
  zzmdfx:       "/ygtbi_fjzl_zzmdfx",       // 分级诊疗_转诊目的分析
  hznlfb:       "/ygtbi_fjzl_hznlfb",       // 分级诊疗_患者年龄性别
  zzjbpm:       "/ygtbi_fjzl_zzjbpm",       // 分级诊疗_转诊疾病排名Top5
  sxzzywsj:     "/ygtbi_fjzl_sxzzywsj",     // 分级诊疗_双向转诊业务数据

  ychzsl:       "/ygtbi_ycyl_ychzsl",       // 远程医疗_远程会诊数量
  yxzxbgl:      "/ygtbi_ycyl_yxzxbgl",      // 远程医疗_影像中心报告量
  xdzxbgl:      "/ygtbi_ycyy_xdzxbgl",      // 远程医疗_心电中心报告量
  zxndsj:       "/ygtbi_ycyl_zxndsj",       // 远程医疗_中心年度数据
  xtndsj:       "/ygtbi_ycyl_xtndsj",       // 远程医疗_协同年度数据
  sqhzsl:       "/ygtbi_ycyl_sqhzsl",       // 远程医疗_申请会诊数量
  yxxtzdbgl:    "/ygtbi_ycyl_yxxtzdbgl",    // 远程医疗_影像协同诊断报告量
  xdxtzdbgl:    "/ygtbi_ycyl_xdxtzdbgl",    // 远程医疗_心电协同诊断报告量

  yljbsjgk:     "/ygtbi_qmjk_yljbsjgk",     // 全民健康_医疗基本数据概况
  wszygk:       "/ygtbi_qmjk_wszygk",       // 全民健康_卫生资源概况
  dzblk:        "/ygtbi_qmjk_dzblk",        // 全民健康_电子病历库
  jkdak:        "/ygtbi_qmjk_jkdak",        // 全民健康_健康档案库
  qyrkk:        "/ygtbi_qmjk_qyrkk",        // 全民健康_全员人口库
  wszyk:        "/ygtbi_qmjk_wszyk",        // 全民健康_卫生资源库
  yzzlzb:       "/ygtbi_qmjk_yzzlzb",       // 全民健康_月增长量指标
};

export default indexUrl;

/**左上--药品监管_基层临床药品概况 */
export const jclcypgk = (param: any = {}) => {
  return POST(indexUrl.jclcypgk, param);
};
/**左下--药品监管_基本药物应用分析 */
export const jbywyyfx = (param: any = {}) => {
  return POST(indexUrl.jbywyyfx, param);
};
/**中间--药品监管_三素一汤占比情况 */
export const ssytzbqk = (param: any = {}) => {
  return POST(indexUrl.ssytzbqk, param);
};
/**右上--药品监管_药品消耗情况排名 */
export const ypxhqkpm = (param: any = {}) => {
  return POST(indexUrl.ypxhqkpm, param);
};
/**右下--药品监管_抗菌药品分析 */
export const kjypfx = (param: any = {}) => {
  return POST(indexUrl.kjypfx, param);
};

/**左中--分级诊疗_医域内转出人次Top5 */
export const qynzcrc = (param: any = {}) => {
  return POST(indexUrl.qynzcrc, param);
};
/**左下--分级诊疗_医域外转往机构Top5 */
export const qywzwjg = (param: any = {}) => {
  return POST(indexUrl.qywzwjg, param);
};
/**中上--分级诊疗_每年转诊数据 */
export const mnzzsj = (param: any = {}) => {
  return POST(indexUrl.mnzzsj, param);
};
/**中左--分级诊疗_本月转诊 */
export const byzz = (param: any = {}) => {
  return POST(indexUrl.byzz, param);
};
/**中右--分级诊疗_转诊目的分析 */
export const zzmdfx = (param: any = {}) => {
  return POST(indexUrl.zzmdfx, param);
};
/**中下--分级诊疗_患者年龄性别 */
export const hznlfb = (param: any = {}) => {
  return POST(indexUrl.hznlfb, param);
};
/**右上--分级诊疗_转诊疾病排名Top5 */
export const zzjbpm = (param: any = {}) => {
  return POST(indexUrl.zzjbpm, param);
};
/**右下--分级诊疗_双向转诊业务数据 */
export const sxzzywsj = (param: any = {}) => {
  return POST(indexUrl.sxzzywsj, param);
};

/**左上--远程医疗_远程会诊数量 */
export const ychzsl = (param: any = {}) => {
  return POST(indexUrl.ychzsl, param);
};
/**左中--远程医疗_影像中心报告量 */
export const yxzxbgl = (param: any = {}) => {
  return POST(indexUrl.yxzxbgl, param);
};
/**左下--远程医疗_心电中心报告量 */
export const xdzxbgl = (param: any = {}) => {
  return POST(indexUrl.xdzxbgl, param);
};
/**中下左--远程医疗_中心年度数据 */
export const zxndsj = (param: any = {}) => {
  return POST(indexUrl.zxndsj, param);
};
/**中下右--远程医疗_协同年度数据 */
export const xtndsj = (param: any = {}) => {
  return POST(indexUrl.xtndsj, param);
};
/**右上--远程医疗_申请会诊数量 */
export const sqhzsl = (param: any = {}) => {
  return POST(indexUrl.sqhzsl, param);
};
/**右中--远程医疗_影像协同诊断报告量 */
export const yxxtzdbgl = (param: any = {}) => {
  return POST(indexUrl.yxxtzdbgl, param);
};
/**右下--远程医疗_心电协同诊断报告量 */
export const xdxtzdbgl = (param: any = {}) => {
  return POST(indexUrl.xdxtzdbgl, param);
};

/**左上--全民健康_医疗基本数据概况 */
export const yljbsjgk = (param: any = {}) => {
  return POST(indexUrl.yljbsjgk, param);
};
/**左下--全民健康_卫生资源概况 */
export const wszygk = (param: any = {}) => {
  return POST(indexUrl.wszygk, param);
};
/**右上左上--全民健康_电子病历库 */
export const dzblk = (param: any = {}) => {
  return POST(indexUrl.dzblk, param);
};
/**右上右上--全民健康_健康档案库 */
export const jkdak = (param: any = {}) => {
  return POST(indexUrl.jkdak, param);
};
/**右上左下--全民健康_全员人口库 */
export const qyrkk = (param: any = {}) => {
  return POST(indexUrl.qyrkk, param);
};
/**右上右下--全民健康_卫生资源库 */
export const wszyk = (param: any = {}) => {
  return POST(indexUrl.wszyk, param);
};
/**右下--全民健康_月增长量指标 */
export const yzzlzb = (param: any = {}) => {
  return POST(indexUrl.yzzlzb, param);
};
