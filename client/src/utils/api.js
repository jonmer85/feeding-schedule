import axios from 'axios';

export default axios.create({
  baseURL: 'https://api-dot-feeding-schedule.uc.r.appspot.com'
});