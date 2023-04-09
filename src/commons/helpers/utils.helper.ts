import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
const slugify = require('slugify');


export const hashString = async (plainPassword: string): Promise<string> => {
  const saltOrRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltOrRounds);
  return hashedPassword;
}

export const compareHash = async (plainText: string, hash: string) => {
  const doesMatch = await bcrypt.compare(plainText, hash);
  return doesMatch;
}

export const sluggify = async (sluggifiable: string) => {
  return slugify(sluggifiable, {
    replacement: process.env.SLUG_STRINGS_REPLACEMENT,
    remove: /[*+~.,()\/\\'"!:@]/g,
    lower: true,
    trim: true
  });
}

export const getRangeWithDots = (current: number, last: number) => {
  var current = current,
    last = last,
    delta = 2,
    left = current - delta,
    right = current + delta + 1,
    range = [],
    rangeWithDots = [],
    l;

  for (let i = 1; i <= last; i++) {
    if (i == 1 || i == last || i >= left && i < right) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }
  return rangeWithDots;
}

export const generateUUID = () => {
  return uuidv4();
}







