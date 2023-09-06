import * as bcrypt from 'bcrypt';
import { networkInterfaces } from 'os';

const encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (password: string, hashPassword: string) => {
  return await bcrypt.compare(password, hashPassword);
};

const generatePassword = () => {
  return Math.random().toString(36).slice(-8);
};

const getEn0Ipv4 = () => {
  const nets = networkInterfaces();
  const en0 = nets.en0;
  return en0.find((item) => item.family === 'IPv4');
};

const Helper = {
  encryptPassword,
  comparePassword,
  generatePassword,
  getEn0Ipv4,
};

export default Helper;
