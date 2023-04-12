import service from "../utils/request";
// 查询年级 分页
export function getGradesApi(pageNo = 1, pageSize = 10,gradeName = '') {
  return service({
    method: "GET",
    url: `/sms/gradeController/getGradeByOpr/${pageNo}/${pageSize}`,
    params: {
      gradeName
    }
  });
}
// 查询所有年级列表

export function getGradesAllApi() {
  return service({
    method: "GET",
    url: `/sms/gradeController/getGrades`,
  });
}
// 修改 保存 年级
export function saveOrUpdateGradeApi(data) {
  return service({
    method: "POST",
    url: `/sms/gradeController/saveOrUpdateGrade`,
    data
  });
}
// 删除年级
export function deleteGradeApi(data) {
  return service({
    method: "DELETE",
    url: `/sms/gradeController/deleteGrade`,
    data
  });
}
