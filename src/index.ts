import {Image as _Image} from './CV'
import { CV as _CV } from './CV'

export namespace CV {
    export const Image = _Image;
    export const grayscale = _CV.grayscale;
    export const threshold = _CV.threshold;
}