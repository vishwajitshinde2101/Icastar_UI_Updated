import React from 'react'
import * as lucideIcons from 'lucide-react'
import type { LucideProps } from 'lucide-react'

// Using keyof on the imported `lucideIcons` object gives us all available icon names.
export type IconName = keyof typeof lucideIcons

// By extending LucideProps, we get the correct types for `size`, `color`, `strokeWidth`, etc.,
// directly from the library. We Omit 'name' from LucideProps to avoid a property conflict
// with standard SVGProps and replace it with our more specific IconName type.
interface IconProps extends Omit<LucideProps, 'name'> {
  name: IconName
}

const Icon: React.FC<IconProps> = ({
  name,
  className,
  size = 24,
  ...props
}) => {
  // Cast the looked-up icon to a generic React ElementType.
  const LucideIconComponent = lucideIcons[name] as React.ElementType

  if (!LucideIconComponent) {
    // Fallback icon. HelpCircle is also a Lucide component and accepts the same props.
    return (
      <lucideIcons.HelpCircle size={size} className={className} {...props} />
    )
  }

  // Pass the destructured `size` and `className`, along with any other props.
  return <LucideIconComponent size={size} className={className} {...props} />
}

export default Icon
