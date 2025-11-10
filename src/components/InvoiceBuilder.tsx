'use client';

import React, { ChangeEvent, useEffect, useRef } from 'react';
import {
  Cross1Icon,
  GitHubLogoIcon,
  HamburgerMenuIcon,
  QuestionMarkCircledIcon,
  DragHandleHorizontalIcon,
} from '@radix-ui/react-icons';
import { Sidebar } from './Sidebar';
import { StoreContext, initStore, store, useAppStateStore } from '@/store';
import { observer } from 'mobx-react-lite';
import { HoverCard, HoverCardContent } from './ui/hover-card';
import { HoverCardTrigger } from '@radix-ui/react-hover-card';
import { TopRightButtons } from './TopRightButtons';
import { AppState } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMediaQuery } from 'react-responsive';
// @ts-ignore
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { NumericFormat } from 'react-number-format';

const driverObj = driver({
  showProgress: true,
  steps: [
    {
      popover: {
        title: 'Invoice Kitchen',
        description:
          'Click anywhere in the invoice to start typing (after this tutorial of course!). You can edit the text just like in any other text editor.',
        position: 'left',
      },
    },
    {
      element: '#business-name-input',
      popover: {
        title: 'Business Name',
        description:
          'For example you can start by entering your business name here.',
        position: 'right',
      },
    },
    {
      popover: {
        title: 'Auto Save',
        description:
          'As you type, your browser automatically saves all your changes. No need to worry about losing your work!',
        position: 'top',
      },
    },
    {
      element: '#sidebar-button',
      popover: {
        title: 'Invoice Menu',
        description:
          'Here you can set tax percentage, select currency for your invoice, and update your company logo.',
        position: 'right',
      },
    },
    {
      element: '#top-right-buttons',
      popover: {
        title: 'Sidebar',
        description:
          'Here are several options. We start everyone out with a example invoice but you can click clear if you want to start from scratch.',
        position: 'left',
      },
    },
    {
      element: '#chef',
      popover: {
        title: 'Chef Tips',
        description:
          'Hover your mouse over the invoice chef and he will give you some friendly tips on how to cook up a great invoice.',
      },
    },
    {
      element: '#end-tour',
      popover: {
        title: 'End of Tutorial',
        description:
          "You're all set to create professional invoices using our online editor. Happy invoicing!",
        position: 'center',
      },
    },
  ],
});

export function cx(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Updates the height of a <textarea> when the value changes.
const useAutosizeTextArea = (
  textAreaRef: HTMLTextAreaElement | null,
  value: string,
) => {
  useEffect(() => {
    if (textAreaRef) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textAreaRef.style.height = '0px';
      const scrollHeight = textAreaRef.scrollHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textAreaRef.style.height = scrollHeight + 'px';
    }
  }, [textAreaRef, value]);
};

interface TextAreaProps {
  className?: string;
  labelClassName?: string;
  placeholder?: string;
  label?: string;
  labelPlaceholder?: string;
  onLabelChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  rows?: number;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rest?: any;
}

const TextArea: React.FC<TextAreaProps> = ({
  className,
  labelClassName,
  placeholder,
  label,
  labelPlaceholder,
  onLabelChange,
  value,
  onChange,
  rows = 4,
  ...rest
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(textAreaRef.current, value);

  return (
    <div className={className}>
      {label && (
        <input
          value={label}
          placeholder={labelPlaceholder}
          onChange={onLabelChange}
          className={labelClassName}
        ></input>
      )}
      <textarea
        ref={textAreaRef}
        className="w-full resize-none"
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </div>
  );
};

interface InputProps {
  className?: string;
  labelClassName?: string;
  placeholder?: string;
  label?: string;
  labelPlaceholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onLabelChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
}

const Input: React.FC<InputProps> = ({
  className,
  labelClassName,
  placeholder,
  label,
  labelPlaceholder,
  onLabelChange,
  value,
  onChange,
  ...rest
}) => {
  return (
    <div className={className}>
      {label !== undefined && (
        <input
          value={label}
          placeholder={labelPlaceholder}
          onChange={onLabelChange}
          className={labelClassName}
        ></input>
      )}
      <input
        className="w-full"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </div>
  );
};
function ClientOnly({ children }: { children: React.ReactNode }) {
  // State / Props
  const [hasMounted, setHasMounted] = React.useState(false);

  // Hooks
  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  // Render
  if (!hasMounted) return null;

  return <div>{children}</div>;
}

export default function InvoiceBuilderWrapper({
  invoice,
}: {
  invoice?: AppState;
}) {
  const store = initStore(invoice);
  return (
    <ClientOnly>
      <StoreContext.Provider value={store}>
        <InvoiceBuilder />
      </StoreContext.Provider>
    </ClientOnly>
  );
}

const InvoiceBuilder = observer(() => {
  const { state, showTour, forceDesktop } = useAppStateStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRendering = !!searchParams.get('render');
  let isMobile = useMediaQuery({ query: '(max-width: 760px)' });
  if (isRendering) {
    isMobile = false;
  }

  if (searchParams.get('token')) {
    router.push('/', { scroll: false });
  }

  useEffect(() => {
    if (showTour && !isMobile) {
      driverObj.drive();
    }
  }, []);

  if (isMobile && !forceDesktop) {
    return (
      <div className="flex flex-col m-4 gap-10 justify-center items-center">
        <pre className="hidden">{JSON.stringify(state, null, 2)}</pre>
        <img src="./chef.svg" className="w-40 h-40" />
        <div className="flex flex-col justify-center items-center">
          <div className="text-2xl font-semibold text-center">
            Invoice Kitchen
          </div>
          <div className="text-sm text-center">
            This app is not currently available on mobile.
          </div>
          <div className="text-sm text-center">
            Please use a desktop browser.
          </div>
        </div>
      </div>
    );
  }

  // Will: Don't remove the hidden div state here.
  // if this isn't used then state never updates in any other component.
  // I think technically every component that uses state should be wrapped in observer
  // but this works so oh well.

  return (
    <div className="h-[100vh] flex">
      <pre className="hidden">{JSON.stringify(state, null, 2)}</pre>
      <Sidebar />
      <MainContent />
    </div>
  );
});

const MainContent: React.FC = () => {
  const { state, setState } = useAppStateStore();

  // Compute the left column span to align title with Description column
  const visibleColumns = [
    true,
    state.showQuantity,
    state.showPrice,
    state.showPrice,
    true,
  ].filter(Boolean);
  const totalColumns = visibleColumns.length;
  const itemColSpan = totalColumns === 1 ? 8 : Math.max(1, 8 - (totalColumns - 1));

  // Determine invoice number from headerFields or fallback
  const invoiceNumber =
    state.headerFields?.find((h: any) => h.label?.toLowerCase().includes('invoice number'))?.value ||
    state.headerFields?.find((h: any) => h.label?.toLowerCase().includes('number'))?.value ||
    'No-07001';

  return (
    <div className="h-full w-full overflow-auto flex justify-center items-center bg-gray-100 pt-8 pb-8 print:pt-0 print:pb-0 print:overflow-hidden">
      <SidebarButton />
      <TopRightButtons />
      <Chef />
      <HelpButton />
      <div
        id="invoice-page"
        className="a4 shadow-lg print:shadow-none m-8 text-black flex flex-col gap-2"
      >
        <Header />
        <div className="border-b border-gray-300" />
        <SubHeader />

  {/* Title (INVOICE) and invoice number aligned above the descriptions */}
  <div className="grid grid-cols-8 gap-4 mt-2 mb-6">
          <div style={{ gridColumn: `span ${itemColSpan}` }}>
            <Input
              className="font-semibold text-2xl"
              placeholder="Tax Invoice"
              value={state.invoiceSubheader}
              onChange={(e) => {
                setState('invoiceSubheader', e.target.value);
              }}
            />
          </div>
          <div style={{ gridColumn: `span ${8 - itemColSpan}` }} className="flex items-start justify-end">
            <span className="font-semibold text-sm text-right">{invoiceNumber}</span>
          </div>
        </div>

        <InvoiceItemsTable />

        <footer className="w-full flex justify-center" style={{ marginTop: '50px' }}>
          <div className="w-full max-w-4xl">
            <AdditionalNotes />
          </div>
        </footer>
      </div>
    </div>
  );
};

const HelpButton: React.FC = () => {
  return (
    <div
      id="help-button"
      className="absolute flex bottom-2 left-2 print:hidden"
    >
      <button
        className="p-4 flex items-center gap-2 hover:text-purple-700 "
        onClick={() => driverObj.drive()}
      >
        <QuestionMarkCircledIcon />
      </button>
      <a
        className="p-4 flex items-center gap-2 hover:text-purple-700 "
        href="https://github.com/wseagar/invoice-kitchen"
      >
        <GitHubLogoIcon />
      </a>
    </div>
  );
};

const SidebarButton: React.FC = () => {
  const { state, setState } = useAppStateStore();
  return !state.sidebarOpen ? (
    <div id="sidebar-button" className="absolute top-2 left-2 print:hidden">
      <button
        className="p-4 flex items-center gap-2 hover:text-purple-700 "
        onClick={() => setState('sidebarOpen', true)}
      >
        <HamburgerMenuIcon /> Menu
      </button>
    </div>
  ) : null;
};

const CHEFS_TIPS = [
  'An invoice without itemised details is like spaghetti without tomato sauce - it lacks substance! Make sure to specify your charges.',
  'Payment terms should be as clear as a bellini cocktail. It keeps any disputes at bay.',
  'Your invoice should reflect your business, just like a perfect tiramisu reflects the skill of the chef.',
  'Keep your invoicing as consistent as a well-made risotto. It helps your clients know what to expect.',
  "No invoice should leave the kitchen without double checking the details - it's like tasting the sauce before you serve it.",
  'Invoice numbers should be as unique as every shape of pasta! Keep them in sequence for easier tracking.',
  "Follow up on unpaid invoices, just like you'd follow up on a missing cannoli order! Don't let them forget.",
  "No overcharging or undercharging. It's like getting the salt right in your pasta water. Be transparent!",
  "Aging? It's good for Parmigiano-Reggiano, not invoices. Aim for them to be paid pronto!",
  'For your international clients, serve your invoices in different currencies, just like offering different types of pasta.',
  'Payment methods should be varied, like the ingredients in a caponata! The more options, the better for your clients.',
  "Put your contact details in your invoice. It's like a recipe - people need to know where to ask their questions!",
  'Late payment fees are the extra kick of chili in arrabbiata sauce - must be mentioned upfront to avoid surprises!',
  "After the invoice is paid, a 'grazie' is always welcome. It's the sweet limoncello after a satisfying meal.",
];

const Chef: React.FC = () => {
  const [tipIdx, setTipIdx] = React.useState(0);
  const tip = CHEFS_TIPS[tipIdx];

  return (
    <div id="chef" className="absolute bottom-2 right-2 print:hidden">
      <HoverCard>
        <HoverCardTrigger>
          <div className="p-4">
            <img src="./chef.svg" className="w-8 h-8" />
          </div>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="text-sm">{tip}</div>
          <div className="flex justify-end">
            <button
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={() => {
                setTipIdx((tipIdx + 1) % CHEFS_TIPS.length);
              }}
            >
              Next tip
            </button>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

const Header: React.FC = () => {
  const { state, setState } = useAppStateStore();
  return (
    <div className="grid grid-cols-5 gap-4  pt-4 ">
      {state.logo && (
        // <div className="col-span-1">
        //   <img
        //     src={state.logo}
        //     alt="logo"
        //     className="w-20 h-20 object-contain"
        //   />
        // </div>
        <div
          className="col-span-1 relative overflow-hidden"
          style={{
            maxWidth: '100px',
            maxHeight: '100px',
          }}
        >
          <img
            src={state.logo}
            alt="logo"
            className="w-full h-full object-contain"
          />
          <div
            className="absolute left-0 top-0 w-full h-full opacity-0 hover:opacity-100 bg-gray-700 bg-opacity-70 cursor-pointer"
            onClick={() => setState('logo', null)}
          >
            <div className="flex justify-center items-center h-full">
              <div className="text-white text-lg select-none">Remove</div>
            </div>
          </div>
        </div>
      )}
      <div className={state.logo ? 'col-span-3' : 'col-span-4'}>
        <Input
          id="business-name-input"
          className="font-semibold text-sm"
          placeholder="Business Name"
          value={state.businessName}
          onChange={(e) => {
            setState('businessName', e.target.value);
          }}
        />
        <TextArea
          className="font-normal text-sm"
          placeholder={`(Your Address)
(Your Phone)
(Your Email)`}
          value={state.businessHeaderFreeText}
          onChange={(e) => {
            setState('businessHeaderFreeText', e.target.value);
          }}
        />
      </div>
      <div>
        {state.headerFields.map((headerField, index) => (
          <Input
            key={index}
            className="font-normal text-sm"
            labelClassName="font-semibold text-sm uppercase tracking-wider"
            label={headerField.label}
            labelPlaceholder={headerField.labelPlaceholder}
            value={headerField.value}
            placeholder={headerField.placeholder}
            onChange={(e) => {
              const newHeaderFields = [...state.headerFields];
              newHeaderFields[index].value = e.target.value;
              setState('headerFields', newHeaderFields);
            }}
            onLabelChange={(e) => {
              const newHeaderFields = [...state.headerFields];
              newHeaderFields[index].label = e.target.value;
              setState('headerFields', newHeaderFields);
            }}
          />
        ))}
      </div>
    </div>
  );
};

const SubHeader: React.FC = () => {
  const { state, setState } = useAppStateStore();
  return (
    <div className="grid grid-cols-4">
      <div className="col-span-4">
        <TextArea
          className="font-normal text-sm mt-2"
          placeholder={`(Customer Name)\n(Customer Address)`}
          value={state.invoiceSubheaderFreeText}
          onChange={(e) => {
            setState('invoiceSubheaderFreeText', e.target.value);
          }}
        />
      </div>
    </div>
  );
};

const InvoiceItemsTable: React.FC = () => {
  const { state, setState, formatAsCurrency } = useAppStateStore();
  const lineItems = state.lineItems;
  const setLineItems = (lineItems: typeof state.lineItems) =>
    setState('lineItems', lineItems);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newLineItems = Array.from(lineItems);
    const [reorderedItem] = newLineItems.splice(result.source.index, 1);
    newLineItems.splice(result.destination.index, 0, reorderedItem);

    setLineItems(newLineItems);
  };

  const subtotal = lineItems.reduce(
    (acc, lineItem) =>
      lineItem ? acc + (lineItem.price || 0) * (lineItem.quantity || 0) : acc,
    0,
  );
  const taxPercent = state.taxRate;
  const tax = state.taxEnabled ? subtotal * (taxPercent || 0) : 0;
  const total = subtotal + tax;

  // Calculate dynamic column spans based on visible columns
  const visibleColumns = [
    true, // Item is always visible
    state.showQuantity,
    state.showPrice, // Price column
    state.showPrice, // Cost column (only if price is shown)
    true, // Amount is always visible
  ].filter(Boolean);
  const totalColumns = visibleColumns.length;
  const itemColSpan =
    totalColumns === 1 ? 8 : Math.max(1, 8 - (totalColumns - 1));

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div>
        <div
          className={`border-y border-gray-300 grid py-2`}
          style={{
            gridTemplateColumns: `${itemColSpan}fr${
              state.showQuantity ? ' 1fr' : ''
            }${state.showPrice ? ' 1fr' : ''}${
              state.showPrice ? ' 1fr' : ''
            } 1fr`,
          }}
        >
          <span className="uppercase tracking-wider font-semibold text-sm">
            Description
          </span>
          {state.showQuantity && (
            <span className="uppercase tracking-wider font-semibold text-sm">
              Qty
            </span>
          )}
          {state.showPrice && (
            <span className="uppercase tracking-wider font-semibold text-sm">
              Price
            </span>
          )}
          {state.showPrice && (
            <span className="uppercase tracking-wider font-semibold text-sm text-right">
              Cost
            </span>
          )}
          <span className="uppercase tracking-wider font-semibold text-sm ">
            Amount(RS)
          </span>
        </div>
        <Droppable droppableId="invoice-items">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {lineItems.map((lineItem, index) =>
                lineItem ? (
                  <Draggable
                    key={index}
                    draggableId={`item-${index}`}
                    index={index}
                  >
                    {(provided2) => (
                      <div
                        ref={provided2.innerRef}
                        {...provided2.draggableProps}
                        key={index}
                        className={`relative border-b border-gray-300 grid py-2 group`}
                        style={{
                          gridTemplateColumns: `${itemColSpan}fr${
                            state.showQuantity ? ' 1fr' : ''
                          }${state.showPrice ? ' 1fr' : ''}${
                            state.showPrice ? ' 1fr' : ''
                          } 1fr`,
                        }}
                      >
                        <div className="absolute left-0 transform -translate-x-full opacity-0 group-hover:opacity-100 flex items-center">
                          <button
                            className="flex w-8 h-8 items-center justify-center"
                            onClick={() => {
                              const nextLineItems = lineItems.filter(
                                (_, idx) => idx !== index,
                              );
                              setLineItems(nextLineItems);
                            }}
                          >
                            <Cross1Icon />
                          </button>
                          <div
                            {...provided2.dragHandleProps}
                            className="flex w-8 h-8 items-center justify-center"
                          >
                            <DragHandleHorizontalIcon />
                          </div>
                        </div>
                        <div>
                          <Input
                            className="font-normal text-sm"
                            placeholder="Item name"
                            value={lineItem.name}
                            onChange={(e) => {
                              const newLineItems = [...lineItems];
                              newLineItems[index].name = e.target.value;
                              setLineItems(newLineItems);
                            }}
                          />
                          <TextArea
                            className="font-light text-sm"
                            placeholder="Describe your item (optional)"
                            value={lineItem.description}
                            rows={1}
                            onChange={(e) => {
                              const newLineItems = [...lineItems];
                              newLineItems[index].description = e.target.value;
                              setLineItems(newLineItems);
                            }}
                          />
                        </div>
                        {state.showQuantity && (
                          <div className="flex items-center">
                            <Input
                              className="font-normal text-sm"
                              placeholder="0"
                              type="number"
                              value={
                                lineItem.quantity !== undefined
                                  ? String(lineItem.quantity)
                                  : ''
                              }
                              onChange={(e) => {
                                const newLineItems = [...lineItems];
                                if (e.target.value === '') {
                                  newLineItems[index].quantity = undefined;
                                  setLineItems(newLineItems);
                                  return;
                                }
                                newLineItems[index].quantity = Number(
                                  e.target.value,
                                );
                                setLineItems(newLineItems);
                              }}
                            />
                          </div>
                        )}
                        {state.showPrice && (
                          <div className="flex items-center">
                            <Input
                              className="font-normal text-sm"
                              placeholder="0.00"
                              type="number"
                              value={
                                lineItem.price !== undefined
                                  ? String(lineItem.price)
                                  : ''
                              }
                              onChange={(e) => {
                                const newLineItems = [...lineItems];
                                if (e.target.value === '') {
                                  newLineItems[index].price = undefined;
                                  setLineItems(newLineItems);
                                  return;
                                }
                                newLineItems[index].price = Number(
                                  e.target.value,
                                );
                                setLineItems(newLineItems);
                              }}
                            />
                          </div>
                        )}
                        {state.showPrice && (
                          <div className="flex items-center justify-end">
                            <Input
                              className="font-normal text-sm text-right"
                              placeholder="Cost"
                              type="number"
                              value={
                                lineItem.cost !== undefined
                                  ? String(lineItem.cost)
                                  : ''
                              }
                              onChange={(e) => {
                                const newLineItems = [...lineItems];
                                if (e.target.value === '') {
                                  newLineItems[index].cost = undefined;
                                  setLineItems(newLineItems);
                                  return;
                                }
                                newLineItems[index].cost = Number(
                                  e.target.value,
                                );
                                setLineItems(newLineItems);
                              }}
                            />
                          </div>
                        )}
                        <div className="flex items-center justify-end">
                          <Input
                            className="font-normal text-sm text-right"
                            placeholder="Amount"
                            type="text"
                            inputMode="decimal"
                            value={
                              lineItem.price !== undefined && lineItem.quantity !== undefined
                                ? ((lineItem.price || 0) * (lineItem.quantity || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                : ''
                            }
                            onChange={(e) => {
                              const newLineItems = [...lineItems];
                              let qty = lineItem.quantity || 0;
                              // Remove commas before parsing
                              let valStr = e.target.value.replace(/,/g, '');
                              let val = valStr === '' ? undefined : parseFloat(valStr);
                              if (val !== undefined && !isNaN(val)) {
                                if (qty > 0) {
                                  newLineItems[index].price = val / qty;
                                } else {
                                  newLineItems[index].quantity = 1;
                                  newLineItems[index].price = val;
                                }
                              } else {
                                newLineItems[index].price = undefined;
                              }
                              setLineItems(newLineItems);
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ) : null,
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <div className="grid grid-cols-8 mt-4">
          <div className="col-span-5">
            <button
              id="add-item-button"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
              onClick={() => {
                setLineItems([
                  ...lineItems,
                  {
                    name: '',
                    description: '',
                    quantity: 0,
                    price: 0,
                    cost: 0,
                  },
                ]);
              }}
            >
              <span>Add Item</span>
              <span>+</span>
            </button>
          </div>
          {state.showSubtotal && (
            <>
              <div className="col-span-1">
                <span className="font-semibold text-sm uppercase tracking-wider">
                  Subtotal
                </span>
              </div>
              <div className="col-span-1" />
              <div className="col-span-1 text-right">
                <span className="font-semibold text-sm">
                  {formatAsCurrency(subtotal)}
                </span>
              </div>
            </>
          )}
        </div>
        {state.taxEnabled && state.showTax && (
          <div className="grid grid-cols-8 mt-4">
            <div className="col-span-5"></div>
            <div className="col-span-2 flex items-center">
              <span className="font-semibold text-sm uppercase tracking-wider mr-2">
                Tax
              </span>
              <span className="font-semibold  text-sm uppercase tracking-wider">
                (
              </span>
              <NumericFormat
                className="font-normal text-sm w-12"
                value={(taxPercent || 0) * 100}
                onValueChange={(value) => {
                  const taxRate = (value.floatValue || 0) / 100;
                  console.log('taxRate', taxRate);
                  setState('taxRate', taxRate);
                }}
                suffix="%"
                allowLeadingZeros={false}
                allowNegative={false}
                decimalScale={2}
                fixedDecimalScale
                customInput={Input}
              />
              <span className="font-semibold  text-sm uppercase tracking-wider">
                )
              </span>
            </div>
            <div className="col-span-1 text-right">
              <span className="font-semibold text-sm">
                {formatAsCurrency(tax)}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-8 mt-2">
          <div className="col-span-4"></div>
          <div className="col-span-1">
            <span className="font-semibold text-sm uppercase tracking-wider">
              Total
            </span>
          </div>
          <div className="col-span-1" />
          <div className="col-span-2 flex justify-end">
            <span className="font-semibold text-sm">
              {formatAsCurrency(total)}
            </span>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

const AdditionalNotes: React.FC = () => {
  const { state, setState } = useAppStateStore();
  return (
    <div className="border-t border-gray-300 pt-35">
      <TextArea
        label={state.notesLabel}
        labelPlaceholder={'Notes'}
        onLabelChange={(e) => {
          setState('notesLabel', e.target.value);
        }}
        value={state.notesFreeText}
        onChange={(e) => {
          setState('notesFreeText', e.target.value);
        }}
        className="font-normal text-sm mt-2"
        labelClassName="font-semibold text-sm uppercase tracking-wider"
        placeholder="Additional notes"
      />
    </div>
  );
};
