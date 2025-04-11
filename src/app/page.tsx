'use client'
import { useEffect, useState } from 'react'
import { CallApi } from '@/utils/callApi'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { isEvenNumber, isHighlight } from '@/utils/utils'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDestructive } from '@/components/alert'

enum FilterType {
     ALL = 'all',
     EVEN = 'even',
     NORMAL = 'normal',
}

interface ForexData {
     success: boolean
     timestamp: number
     base: string
     date: string
     rates: Record<string, number>
}

type SortKey = 'currency' | 'original' | 'new'
type SortDirection = 'asc' | 'desc'

interface Rates {
     [key: string]: number
}

export default function Home() {
     // data
     const [forexData, setForexData] = useState<{ base: string; date: string; rates: Rates }>({ base: '', date: '', rates: {} })
     // loading
     const [loading, setLoading] = useState(true)
     // search item
     const [search, setSearch] = useState('')
     // pagination, filter
     const [currentPage, setCurrentPage] = useState(1)
     const [itemsPerPage, setItemPerPage] = useState<number | 'ALL'>(10)
     const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL)
     const [sortKey, setSortKey] = useState<SortKey>('currency')
     const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
     // error alert
     const [hasError, setHasError] = useState(false)

     // filtered data
     const filtered = Object.entries(forexData.rates)
          .filter(([currency, rate]) => {
               const matchesFilter = filterType === FilterType.ALL || (filterType === FilterType.EVEN && isEvenNumber(rate)) || (filterType === FilterType.NORMAL && !isEvenNumber(rate))
               const matchesSearch = currency.toLowerCase().includes(search.toLowerCase())
               return matchesFilter && matchesSearch
          })
          .sort((a, b) => {
               const [currencyA, rateA] = a
               const [currencyB, rateB] = b

               let compare = 0
               if (sortKey === 'currency') compare = currencyA.localeCompare(currencyB)
               else if (sortKey === 'original') compare = rateA - rateB
               else if (sortKey === 'new') compare = rateA + 10.0002 - (rateB + 10.0002)

               return sortDirection === 'asc' ? compare : -compare
          })

     // calculate total row per page
     const totalPage = Math.max(1, Math.ceil(filtered.length / (itemsPerPage === 'ALL' ? filtered.length : itemsPerPage)))
     const paginationFiltered = filtered.slice((currentPage - 1) * (itemsPerPage === 'ALL' ? filtered.length : itemsPerPage), currentPage * (itemsPerPage === 'ALL' ? filtered.length : itemsPerPage))

     const toggleSort = (key: SortKey) => {
          if (sortKey === key) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
          else {
               setSortKey(key)
               setSortDirection('asc')
          }
     }

     const demoData = {
          success: true,
          timestamp: 1744351684,
          base: 'EUR',
          date: '2025-04-11',
          rates: {
               AED: 4.13567,
               AFN: 79.800087,
               ALL: 98.524805,
               AMD: 430.856434,
               ANG: 2.015671,
               AOA: 1033.615048,
               ARS: 1211.894226,
               AUD: 1.815803,
               AWG: 2.029511,
               AZN: 1.911436,
               BAM: 1.94813,
               BBD: 2.228633,
               BDT: 134.092092,
               BGN: 1.945527,
               BHD: 0.424432,
               BIF: 3280.800356,
               BMD: 1.125942,
               BND: 1.474846,
               BOB: 7.624325,
               BRL: 6.62839,
               BSD: 1.103806,
               BTC: 1.3885145e-5,
               BTN: 95.010465,
               BWP: 15.568061,
               BYN: 3.612113,
               BYR: 22068.46855,
               BZD: 2.217108,
               CAD: 1.573437,
               CDF: 3239.33602,
               CHF: 0.927951,
               CLF: 0.02903,
               CLP: 1113.996022,
               CNY: 8.235709,
               CNH: 8.252054,
               COP: 4921.212189,
               CRC: 567.501084,
               CUC: 1.125942,
               CUP: 29.83747,
               CVE: 109.796175,
               CZK: 25.073588,
               DJF: 196.354004,
               DKK: 7.466804,
               DOP: 68.345181,
               DZD: 149.465517,
               EGP: 57.798448,
               ERN: 16.889134,
               ETB: 145.556962,
               EUR: 1,
               FJD: 2.582517,
               FKP: 0.881668,
               GBP: 0.866867,
               GEL: 3.107732,
               GGP: 0.881668,
               GHS: 17.099984,
               GIP: 0.881668,
               GMD: 81.067377,
               GNF: 9553.642773,
               GTQ: 8.51158,
               GYD: 230.874665,
               HKD: 8.733276,
               HNL: 28.596482,
               HRK: 7.519268,
               HTG: 144.149142,
               HUF: 407.42448,
               IDR: 18918.419853,
               ILS: 4.205847,
               IMP: 0.881668,
               INR: 96.996831,
               IQD: 1445.76594,
               IRR: 47416.245021,
               ISK: 145.055293,
               JEP: 0.881668,
               JMD: 174.627324,
               JOD: 0.798182,
               JPY: 162.051804,
               KES: 146.030849,
               KGS: 98.464055,
               KHR: 4419.991476,
               KMF: 500.478531,
               KPW: 1013.362925,
               KRW: 1632.120812,
               KWD: 0.34572,
               KYD: 0.919732,
               KZT: 569.460961,
               LAK: 23910.521066,
               LBP: 98895.913822,
               LKR: 327.852951,
               LRD: 220.658576,
               LSL: 21.443849,
               LTL: 3.324615,
               LVL: 0.681072,
               LYD: 6.133697,
               MAD: 10.445405,
               MDL: 19.608156,
               MGA: 5015.965409,
               MKD: 61.448991,
               MMK: 2363.65395,
               MNT: 3952.097244,
               MOP: 8.82232,
               MRU: 43.66481,
               MUR: 50.112593,
               MVR: 17.341416,
               MWK: 1912.354944,
               MXN: 23.063453,
               MYR: 4.995244,
               MZN: 71.958864,
               NAD: 21.442521,
               NGN: 1790.529952,
               NIO: 40.611918,
               NOK: 12.111665,
               NPR: 152.077739,
               NZD: 1.951286,
               OMR: 0.4335,
               PAB: 1.103396,
               PEN: 4.101553,
               PGK: 4.493589,
               PHP: 64.245109,
               PKR: 309.604488,
               PLN: 4.274809,
               PYG: 8840.413132,
               QAR: 4.021592,
               RON: 4.976552,
               RSD: 117.117166,
               RUB: 94.016257,
               RWF: 1589.348917,
               SAR: 4.226781,
               SBD: 9.406532,
               SCR: 16.132964,
               SDG: 676.130979,
               SEK: 11.054451,
               SGD: 1.49541,
               SHP: 0.884814,
               SLE: 25.648773,
               SLL: 23610.447711,
               SOS: 630.806216,
               SRD: 41.5924,
               STD: 23304.731781,
               SVC: 9.657537,
               SYP: 14639.860358,
               SZL: 21.432193,
               THB: 37.919505,
               TJS: 11.989202,
               TMT: 3.940798,
               TND: 3.362512,
               TOP: 2.637067,
               TRY: 42.854483,
               TTD: 7.493996,
               TWD: 36.841845,
               TZS: 3006.266207,
               UAH: 45.734646,
               UGX: 4065.639885,
               USD: 1.125942,
               UYU: 47.389962,
               UZS: 14318.392865,
               VES: 86.830472,
               VND: 28947.975837,
               VUV: 142.072363,
               WST: 3.247416,
               XAF: 652.937025,
               XAG: 0.035981,
               XAU: 0.000353,
               XCD: 3.042916,
               XDR: 0.812687,
               XOF: 653.474293,
               XPF: 119.331742,
               YER: 276.195054,
               ZAR: 21.892754,
               ZMK: 10134.832186,
               ZMW: 31.120765,
               ZWL: 362.552953,
          },
     }

     useEffect(() => {
          const fetchRates = async () => {
               try {
                    const result: ForexData = await CallApi.getForeignCurrency()

                    if (!result.success) {
                         return
                    }

                    setForexData(result)
                    setCurrentPage(1)
                    setHasError(false)
               } catch (err) {
                    setHasError(true)
               } finally {
                    setLoading(false)
               }
          }

          fetchRates()
     }, [filterType])

     useEffect(() => {
          setCurrentPage(1)
     }, [itemsPerPage])

     return (
          <div className="min-h-screen bg-gray-50 py-8 pb-24">
               <div className="container mx-auto px-4 w-300">
                    <Card className="shadow-lg py-0 gap-0">
                         <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
                              <div className="flex item-center justify-between py-5">
                                   <div>
                                        <CardTitle className="text-2xl font-bold flex items-center text-2xl md:text-lg">Forex Rates Table</CardTitle>
                                        <p className="text-slate-200 mt-1 text-2xl md:text-lg">Base Currency: {forexData.base}</p>
                                        <p className="text-slate-200 mt-1 text-2xl md:text-lg">Date: {forexData.date}</p>
                                   </div>
                              </div>
                         </CardHeader>
                         <div className="flex flex-row justify-between items-center p-4">
                              <div className="space-x-2">
                                   {[FilterType.ALL, FilterType.EVEN, FilterType.NORMAL].map((type) => (
                                        <Button
                                             key={type}
                                             variant="link"
                                             className={`px-3 py-1 text-2xl md:text-sm ${filterType === type ? 'underline font-semibold text-black' : 'text-gray-600'}`}
                                             onClick={() => setFilterType(type)}
                                        >
                                             {type.toUpperCase()}
                                        </Button>
                                   ))}
                              </div>
                              <div>
                                   <input
                                        type="text"
                                        placeholder="Search currency..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="border px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 text-2xl md:text-sm"
                                   />
                              </div>
                         </div>
                         <CardContent className="py-1">
                              {loading ? (
                                   <div className="flex justify-center items-center h-50">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-800"></div>
                                   </div>
                              ) : hasError ? (
                                   <div className="px-4 pt-4 pb-4">
                                        <AlertDestructive></AlertDestructive>
                                   </div>
                              ) : (
                                   <div className="overflow-x-auto">
                                        <div className={`${itemsPerPage === 'ALL' ? 'max-h-[600px] overflow-y-auto' : ''}`}>
                                             <Table>
                                                  <TableHeader className="bg-slate-100">
                                                       <TableRow>
                                                            {['currency', 'original', 'new'].map((key) => (
                                                                 <TableHead key={key} className="font-bold text-center text-2xl md:text-sm cursor-pointer" onClick={() => toggleSort(key as SortKey)}>
                                                                      {key.charAt(0).toUpperCase() + key.slice(1)} {sortKey === key && (sortDirection === 'asc' ? '▲' : '▼')}
                                                                 </TableHead>
                                                            ))}
                                                       </TableRow>
                                                  </TableHeader>
                                                  <TableBody>
                                                       {paginationFiltered.map(([currency, rate]) => (
                                                            <TableRow
                                                                 key={currency}
                                                                 className={`${
                                                                      isHighlight(currency, rate) ? 'border-l-4 border-red-500 bg-red-50' : ''
                                                                 } text-center hover:bg-slate-50 transition-colors`}
                                                            >
                                                                 <TableCell className="font-medium text-2xl md:text-sm">
                                                                      <div className="flex item-center">
                                                                           {currency}
                                                                           {isEvenNumber(rate) && (
                                                                                <Badge variant="outline" className="ml-2 text-xs bg-red-100 text-red-800 border-red-200">
                                                                                     Even
                                                                                </Badge>
                                                                           )}
                                                                      </div>
                                                                 </TableCell>
                                                                 <TableCell className="text-2xl md:text-sm">{rate.toFixed(4)}</TableCell>
                                                                 <TableCell className="text-2xl md:text-sm">{(rate + 10.0002).toFixed(4)}</TableCell>
                                                            </TableRow>
                                                       ))}
                                                  </TableBody>
                                             </Table>
                                        </div>
                                        <div className="flex justify-between items-center my-4 px-4">
                                             <div />
                                             <div className="">
                                                  <Pagination>
                                                       <PaginationContent>
                                                            <PaginationItem>
                                                                 <PaginationPrevious
                                                                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                                                      className={currentPage === 1 ? 'pointer-events-none opacity-50 text-2xl md:text-sm' : 'text-2xl md:text-sm'}
                                                                 />
                                                            </PaginationItem>
                                                            {[...Array(totalPage)].map((_, index) => {
                                                                 const page = index + 1
                                                                 const isFirst = page === 1
                                                                 const isLast = page === totalPage
                                                                 const isNearCurrent = Math.abs(currentPage - page) <= 1
                                                                 if (isFirst || isLast || isNearCurrent) {
                                                                      return (
                                                                           <PaginationItem key={page}>
                                                                                <PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page} className="text-2xl md:text-sm">
                                                                                     {page}
                                                                                </PaginationLink>
                                                                           </PaginationItem>
                                                                      )
                                                                 }
                                                                 if ((page === currentPage - 2 && page > 1) || (page === currentPage + 2 && page < totalPage)) {
                                                                      return (
                                                                           <PaginationItem key={`ellipsis-${page}`} className="text-2xl md:text-sm">
                                                                                <PaginationEllipsis />
                                                                           </PaginationItem>
                                                                      )
                                                                 }
                                                                 return null
                                                            })}
                                                            <PaginationItem>
                                                                 <PaginationNext
                                                                      onClick={() => setCurrentPage((prev) => Math.min(totalPage, prev + 1))}
                                                                      className={currentPage === totalPage ? 'pointer-events-none opacity-50' : ''}
                                                                 />
                                                            </PaginationItem>
                                                       </PaginationContent>
                                                  </Pagination>
                                             </div>
                                             <div className="text-2xl md:text-sm">
                                                  <Select onValueChange={(value) => setItemPerPage(value === 'ALL' ? 'ALL' : Number.parseInt(value))} defaultValue="10">
                                                       <SelectTrigger className="w-[100px]">
                                                            <SelectValue placeholder="Items" />
                                                       </SelectTrigger>
                                                       <SelectContent>
                                                            {['ALL', '5', '10', '15', '20'].map((v) => (
                                                                 <SelectItem key={v} value={v}>
                                                                      {v}
                                                                 </SelectItem>
                                                            ))}
                                                       </SelectContent>
                                                  </Select>
                                             </div>
                                        </div>
                                   </div>
                              )}
                         </CardContent>
                    </Card>
               </div>
          </div>
     )
}
