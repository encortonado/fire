import { IonicSafeString } from "@ionic/angular";
import { AlertAttributes, AlertButton, AlertInputAttributes, AlertTextareaAttributes, AnimationBuilder, Mode, TextFieldTypes } from "@ionic/core";

export interface AlertDialog {
  text: string;
  role?: 'cancel' | 'destructive' | string;
  cssClass?: string | string[];
  handler?: (value: any) => boolean | void | {[key: string]: any};
}

interface AlertInput {
  type?: TextFieldTypes | 'checkbox' | 'radio' | 'textarea';
  name?: string;
  placeholder?: string;
  value?: any;
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  id?: string;
  handler?: (input: AlertInput) => void;
  min?: string | number;
  max?: string | number;
  cssClass?: string | string[];
  attributes?: AlertInputAttributes | AlertTextareaAttributes;
  tabindex?: number;
}

interface AlertOptions {
  header?: string;
  subHeader?: string;
  message?: string | IonicSafeString;
  cssClass?: string | string[];
  inputs?: AlertInput[];
  buttons?: (AlertButton | string)[];
  backdropDismiss?: boolean;
  translucent?: boolean;
  animated?: boolean;
  htmlAttributes?: AlertAttributes;

  mode?: Mode;
  keyboardClose?: boolean;
  id?: string;

  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;
}

type AlertInputAttributes = JSXBase.InputHTMLAttributes<HTMLInputElement>

