import request from '@/utils/request'

export function loadContourData() {
  return request({
    url: '/contour/getContourData',
    method: 'get',
  })  
}
export function set_contour_settings(settings) {
    return request({
      url: '/contour/setContourSettings',
      method: 'post',
      data:settings
    })  
  }
export function get_contour_settings() {
    return request({
      url: '/contour/getContourSettings',
      method: 'get'
    })  
  }
  