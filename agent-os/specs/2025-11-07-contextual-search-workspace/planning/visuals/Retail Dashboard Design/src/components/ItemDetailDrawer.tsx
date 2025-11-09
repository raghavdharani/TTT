import { ItemRecord } from '../App';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Edit, Trash2, Copy } from 'lucide-react';

interface ItemDetailDrawerProps {
  item: ItemRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ItemDetailDrawer({ item, open, onOpenChange }: ItemDetailDrawerProps) {
  if (!item) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <SheetTitle className="text-gray-900 mb-2">
                {item.description}
              </SheetTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  className={`rounded-full ${
                    item.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {item.status}
                </Badge>
                <span className="text-sm text-gray-600">SKU: {item.sku}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-lg">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-lg text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4 rounded-lg">
            <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
            <TabsTrigger value="pricing" className="rounded-lg">Pricing</TabsTrigger>
            <TabsTrigger value="inventory" className="rounded-lg">Inventory</TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <Card className="p-4 rounded-lg">
              <h3 className="text-gray-900 mb-4">Item Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900">{item.sku}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">UPC</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900">{item.upc}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Department</span>
                  <span className="text-gray-900">{item.department}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Class</span>
                  <span className="text-gray-900">{item.class}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Vendor</span>
                  <span className="text-gray-900">{item.vendor}</span>
                </div>
                {item.size && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size</span>
                      <span className="text-gray-900">{item.size}</span>
                    </div>
                  </>
                )}
                {item.color && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-gray-600">Color</span>
                      <span className="text-gray-900">{item.color}</span>
                    </div>
                  </>
                )}
                {item.season && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-gray-600">Season</span>
                      <span className="text-gray-900">{item.season}</span>
                    </div>
                  </>
                )}
              </div>
            </Card>

            <Card className="p-4 rounded-lg">
              <h3 className="text-gray-900 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-600 text-sm mb-1">Retail Price</div>
                  <div className="text-gray-900">${item.retailPrice.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm mb-1">Wholesale Price</div>
                  <div className="text-gray-900">${item.wholesalePrice.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm mb-1">Margin</div>
                  <div className="text-green-600">
                    {(((item.retailPrice - item.wholesalePrice) / item.retailPrice) * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm mb-1">Status</div>
                  <Badge
                    className={`rounded-full ${
                      item.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4 mt-4">
            <Card className="p-4 rounded-lg">
              <h3 className="text-gray-900 mb-4">Pricing Details</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Wholesale Price</span>
                    <span className="text-gray-900">${item.wholesalePrice.toFixed(2)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${(item.wholesalePrice / item.retailPrice) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Retail Price</span>
                    <span className="text-gray-900">${item.retailPrice.toFixed(2)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1976D2]" style={{ width: '100%' }} />
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Margin</span>
                  <span className="text-green-600">
                    ${(item.retailPrice - item.wholesalePrice).toFixed(2)} (
                    {(((item.retailPrice - item.wholesalePrice) / item.retailPrice) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-4 rounded-lg">
              <h3 className="text-gray-900 mb-4">Price History</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nov 1, 2025</span>
                  <span className="text-gray-900">$149.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Oct 1, 2025</span>
                  <span className="text-gray-900">$149.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sep 1, 2025</span>
                  <span className="text-gray-900">$139.99</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4 mt-4">
            <Card className="p-4 rounded-lg">
              <h3 className="text-gray-900 mb-4">Inventory Status</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-600 text-sm mb-1">On Hand</div>
                    <div className="text-gray-900">245 units</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm mb-1">On Order</div>
                    <div className="text-gray-900">120 units</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm mb-1">Reserved</div>
                    <div className="text-gray-900">18 units</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm mb-1">Available</div>
                    <div className="text-green-600">227 units</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 rounded-lg">
              <h3 className="text-gray-900 mb-4">Store Distribution</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Store #001 - Downtown</span>
                  <span className="text-gray-900">85 units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Store #002 - Eastside</span>
                  <span className="text-gray-900">72 units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Store #003 - Westgate</span>
                  <span className="text-gray-900">88 units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Warehouse</span>
                  <span className="text-gray-900">0 units</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-4">
            <Card className="p-4 rounded-lg">
              <h3 className="text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#1976D2] mt-1.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-gray-900 text-sm">Price updated</div>
                    <div className="text-gray-600 text-sm">Retail price changed from $139.99 to $149.99</div>
                    <div className="text-gray-500 text-xs mt-1">Nov 1, 2025 at 2:45 PM</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-gray-400 mt-1.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-gray-900 text-sm">Inventory adjustment</div>
                    <div className="text-gray-600 text-sm">Stock increased by 50 units</div>
                    <div className="text-gray-500 text-xs mt-1">Oct 28, 2025 at 10:15 AM</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-gray-400 mt-1.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-gray-900 text-sm">Item created</div>
                    <div className="text-gray-600 text-sm">Item added to catalog</div>
                    <div className="text-gray-500 text-xs mt-1">Oct 15, 2025 at 9:00 AM</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 rounded-lg">
              <h3 className="text-gray-900 mb-4">Audit Trail</h3>
              <div className="text-sm text-gray-600">
                <p className="mb-2"><strong className="text-gray-900">Last Modified:</strong> {item.lastModified}</p>
                <p className="mb-2"><strong className="text-gray-900">Modified By:</strong> John Smith</p>
                <p><strong className="text-gray-900">Created:</strong> Oct 15, 2025</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
