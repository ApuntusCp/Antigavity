/**
 * Gran Colinos — Boxicons
 * Replaces all native emojis across the app.
 */

const boxicon = (name, className = '', size = 24) => `
  <i class='bx ${name} ${className}' style='font-size: ${size}px; vertical-align: middle;'></i>
`;

export const icons = {
  Leaf: (className = '', size = 24) => boxicon('bx-leaf', className, size),
  Sprout: (className = '', size = 24) => boxicon('bx-spa', className, size),
  Cart: (className = '', size = 24) => boxicon('bx-shopping-bag', className, size),
  Close: (className = '', size = 24) => boxicon('bx-x', className, size),
  Home: (className = '', size = 24) => boxicon('bx-home-alt', className, size),
  Sparkles: (className = '', size = 24) => boxicon('bxs-magic-wand', className, size),
  Heart: (className = '', size = 24) => boxicon('bx-heart', className, size),
  Clipboard: (className = '', size = 24) => boxicon('bx-clipboard', className, size),
  DollarSign: (className = '', size = 24) => boxicon('bx-dollar', className, size),
  Truck: (className = '', size = 24) => boxicon('bxs-truck', className, size),
  Star: (className = '', size = 24) => boxicon('bxs-star', className, size),
  Package: (className = '', size = 24) => boxicon('bx-package', className, size),
  Check: (className = '', size = 24) => boxicon('bx-check', className, size),
  CreditCard: (className = '', size = 24) => boxicon('bx-credit-card', className, size),
  Bot: (className = '', size = 24) => boxicon('bx-bot', className, size),
  MessageCircle: (className = '', size = 24) => boxicon('bx-message-rounded-dots', className, size),
  Send: (className = '', size = 24) => boxicon('bx-send', className, size),
  ChevronDown: (className = '', size = 24) => boxicon('bx-chevron-down', className, size),
  Minus: (className = '', size = 24) => boxicon('bx-minus', className, size),
  Trash: (className = '', size = 24) => boxicon('bx-trash', className, size),
  FileText: (className = '', size = 24) => boxicon('bx-file-blank', className, size),
  Shield: (className = '', size = 24) => boxicon('bx-shield-quarter', className, size),
  MapPin: (className = '', size = 24) => boxicon('bxs-map', className, size),
  Flame: (className = '', size = 24) => boxicon('bxs-hot', className, size)
};
