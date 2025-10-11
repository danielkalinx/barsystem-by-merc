import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Settings } from 'lucide-react'

export default function PreviewPage() {
  return (
    <div className="container mx-auto px-6 pt-32 space-y-12">
      <div>
        <h1 className="text-4xl font-bold mb-2">Component Preview</h1>
        <p className="text-muted-foreground">Testing ground for UI components</p>
      </div>

      {/* Button Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Button Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      {/* Button Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Button Sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* Icon Buttons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Icon Buttons</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="icon-sm" variant="outline">
            <Plus className="size-4" />
          </Button>
          <Button size="icon">
            <Plus className="size-4" />
          </Button>
          <Button size="icon-lg">
            <Plus className="size-5" />
          </Button>
        </div>
      </section>

      {/* Buttons with Icons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Buttons with Icons</h2>
        <div className="flex flex-wrap gap-4">
          <Button size="sm">
            <Plus />
            Add Item
          </Button>
          <Button>
            <Settings />
            Settings
          </Button>
          <Button size="lg">
            <Trash2 />
            Delete
          </Button>
        </div>
      </section>

      {/* All Variant + Size Combinations */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">All Combinations</h2>
        <div className="space-y-6">
          {(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const).map(
            (variant) => (
              <div key={variant} className="space-y-2">
                <h3 className="text-lg font-medium capitalize">{variant}</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <Button variant={variant} size="sm">
                    Small
                  </Button>
                  <Button variant={variant} size="default">
                    Default
                  </Button>
                  <Button variant={variant} size="lg">
                    Large
                  </Button>
                </div>
              </div>
            ),
          )}
        </div>
      </section>

      {/* Disabled States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Disabled States</h2>
        <div className="flex flex-wrap gap-4">
          <Button disabled>Default Disabled</Button>
          <Button variant="destructive" disabled>
            Destructive Disabled
          </Button>
          <Button variant="outline" disabled>
            Outline Disabled
          </Button>
          <Button variant="secondary" disabled>
            Secondary Disabled
          </Button>
        </div>
      </section>

      {/* With Icons - All Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">With Icons - All Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">
            <Plus />
            Default
          </Button>
          <Button variant="destructive">
            <Trash2 />
            Destructive
          </Button>
          <Button variant="outline">
            <Settings />
            Outline
          </Button>
          <Button variant="secondary">
            <Plus />
            Secondary
          </Button>
          <Button variant="ghost">
            <Settings />
            Ghost
          </Button>
        </div>
      </section>

      {/* Icon Only - All Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Icon Only - All Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default" size="icon">
            <Plus />
          </Button>
          <Button variant="destructive" size="icon">
            <Trash2 />
          </Button>
          <Button variant="outline" size="icon">
            <Settings />
          </Button>
          <Button variant="secondary" size="icon">
            <Plus />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings />
          </Button>
        </div>
      </section>

      {/* Input States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Input States</h2>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-sm font-medium">Default</label>
            <Input placeholder="Placeholder" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Filled</label>
            <Input placeholder="Placeholder" defaultValue="Filled input value" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Disabled</label>
            <Input placeholder="Placeholder" disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Error</label>
            <Input placeholder="Placeholder" aria-invalid />
          </div>
        </div>
      </section>

      {/* Input Types */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Input Types</h2>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-sm font-medium">Text</label>
            <Input type="text" placeholder="Enter text" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" placeholder="email@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input type="password" placeholder="Enter password" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Number</label>
            <Input type="number" placeholder="0" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">File</label>
            <Input type="file" />
          </div>
        </div>
      </section>
    </div>
  )
}
