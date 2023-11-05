"use client";
import {useState} from "react";
import StarRating from "@/components/starRating";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion"

const FoodDetails =
    {
        id: 123123123,
        name: "Chicken Biryani",
        price: "10.99",
        review: 3,
        des: "Chicken Biryani is a savory chicken and rice dish that includes layers of chicken, rice, and aromatics that are steamed together. The bottom layer of rice absorbs all the chicken juices as it cooks, giving it a tender texture and rich flavor, while the top layer of rice turns out white and fluffy.",
        ingredients: "Chicken, Rice, Spices, Oil, Onion, Tomato, Ginger, Garlic, Green Chilli, Coriander, Mint, Yogurt, Lemon, Ghee, Saffron, Milk, Water",
        image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2019/02/chicken-biryani-recipe-500x500.jpg",
        ethnicType: "Indian",
        mayContainNuts: "Yes",
        halal: "Hand Slaughtered",
    }


export default function Food() {
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');

    const incrementQuantity = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity((prevQuantity) => prevQuantity - 1);
        }
    };

    const selectSize = (size: string) => {
        setSelectedSize(size);
    };

    const addToCart = () => {
        console.log({
            id: FoodDetails.id,
            size: selectedSize,
            quantity: quantity,
            // include any other details you might need
        });
    };

    // Define a function to render size buttons with conditional styling
    const renderSizeButton = (size: string) => (
        <button
            onClick={() => selectSize(size)}
            className={`border rounded-full px-4 py-2.5 font-semibold text-primary-color shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color ${selectedSize === size ? 'bg-primary-color text-white hover:bg-primary-color-hover' : 'bg-white hover:bg-gray-50'}`}
        >
            {size}
        </button>
    );

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div>
                        <img
                            src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBUVFBgVFRUZGRgaGxwcGxsbGiAjIBogIBsgIBodGxsdIi0kHiApJBsaJTglKS4wNDQ0GyM5PzkyPi0yNDABCwsLEA8QHhISHTQpIykyMjIyMjIyMjI1MjIyMjIyNTIyOzIyMjQ1MjIyMjIyMjIyMjIyMDAyMjIyMjIyMjIyMv/AABEIALQBGAMBIgACEQEDEQH/xAAcAAAABwEBAAAAAAAAAAAAAAAAAQIDBAUGBwj/xAA/EAABAgQDBQcBBgYCAQUBAAABAhEAAyExBBJBBVFhcZEGEyIygaHwsUJSYsHR4QcUI3Ki8TOyFUOCkuLyFv/EABkBAAMBAQEAAAAAAAAAAAAAAAABAgMEBf/EACcRAAICAgICAgAHAQAAAAAAAAABAhEDIRIxBEEiURMyYXGhsfAU/9oADAMBAAIRAxEAPwDlYgxCRCh6RBQcBoLpA6QDA0G0EPSDA5QCFAQsCEj0hQMUAYELEIEKEIB5Ji+7PbJ7051PkTw8x3DgNaxA2Jswz1tZCaqP5DiY6FKCEIShBYAMALM5FOYbryhpAwd4EDKA9GcpNGPDdw5REmTXIsL19GFzwg3JJ8R+V+NupCVuL8biAAKm1ajOBoNT+3qYmSSk73PFy7cQWPiNeL7oiLQ9DWjW48Wb9+cPS02ZR0vT2HH/AKCAQ6EoINU6ioYmj0BLD/8AI1MR0SkMcyhQbjxNCBwbTXdC1FW8NSz6JFPp06oQgsQwtvO5Qp101bfUAhY0JBFCSFAOp2u7vUabrvE5SqWHygteyT8DRcRKB92ygi546V6GJCmfzMNz7yeO4g+h3wwJmGxBToN1Pnz1BiU6VgpNjxtQa76RUhQBvXWo5+oqenpE6RMpq7F768uY6tqDABBnoWgkMTqCS/xt0RJy96k2sL9BGkElE5LEXqHcsatxjN47BqlqPesgDRIckaFzpEtDTIE1Zd7Depg8NFQbzD0eFrW4dKAB95VTDBmaOo8kiEMQtQ+8OhhlSuI6GHlA/dV1hiY/wwAMTFRFWqJE084jkwANl4Sow4TDauUADbwDCyIS0IYggwIcgQAVtN0GOUJA5woQyQEjdBgwVYMQAB4MEQTwp4AACIWDCXgxFAGDEvZ+DVNmCWi510SNSYiy5ZUQEgkksALk6COl9mtjjDyyVAFavMXs2g4CvN+MCQWTMFgUSpYloo1zVy4qTx/1YRHXNr96v52razesSJi3BpQuKkFnvpWIhSWpqD8p89YbEEg8D8pDjl33vqPlj+cNy0m/Djb1I+PDiwLtTkPl4QBkMwIS3Mb6jf8A64w+GNCAenE6evUbhDK28LgjlzJ1+Wh+Wi1SH3gbv3Gmp9QATEeLy9H4g6tUv0EKBYbrXJbTR+I991QtALFw/qHpu3v83LRs6YoeFClWNEKL2NKfPSGIrMXZwBqbg6byKWFYcILWodXNaHdZ2eJU3Y2JYNKmU0yK0Gv0po/qa9mzEDxS1J1qkhvjH4YAISvNU6gsw3l9H13tTnDqJjAEHXk9v0b1hEuU7Urp4jv5V+a3JUok0YnrxgGWcjFANod/79OkKxUpOISZZofsKZ2pbiLBuEQpSMoHK4Aa/wBPo8O4VZSs1Jbj6b/wwAZTHyloUZaw2Qs2h4gtXnDa5u6g0aNptbZgny6JaYnyqceoNdacm4mMJMCkKKVAhQLEHQ8YloaYFlW8wysNBqmk8IaUfhiRja3PKGlQ6s/PlIZVDAQ0BoUISYAEGCYwoiA0IBMCFwIAKkQAYA+fHgZfSKEGDC4ID5/qB8vCAODBgm+UgwIYBgwoQkRqOyuw8xE+aPAPIkjzn739o9+QgQFp2R2BkAnTQAojwJLOkalnuR7Hi0aJaqs9WFzw6w3MxOZVgKWpw3Ft46wyZni9qRQha0uFb+bvvr8tDSJVCCKB6nnT5ufhD0tNRrfS9BqIUhIe+m/iLU4wANpwwfhZxevr8aAcLUkMTXWjseFa6w9h5aszM5dg1Sa0YAVjSYDYiJfjm+JX3H8Ip9pvMeFucD0IpsFsmbMqkBKbZlgAacKngOWkXUnZsmWHmKznV2Sjhx9XESsTilXAKm0G7hHP+1U3ETJ6pSJalpCDkyGudgc6uCSWaMJ5a6NseNSezfoxaQHlBAGhQBVqea5s19ISvGrN1E+pjmnYrFzJa1mZmYgJKCPFnzMCBZvxUFY6ZhkuEnIXLODpw+UjGWeuzV4qehg4pUPS8dMAd1NzMN42c6glMtSnBOYMlCQAPMSzGtqm+6IapiEpUvO7p8CBXOWo2jH70KOZP2T+G+ixXiUL/wCRCFcVJD//ACFYh4jYcmY5lqUg7j4kv/2FecVGH2oozEoWB4jlygMx3EvcAPq7wxiO1cuXMMtSCCFFLvuLPaxofWKXkpIt+K26Q/i9mzJJ8SfCTRSWKT66HgQDb0ryshZq49+vzSNJ2f24ZwXQAAsRd7uFA3t7we09gJmeOT4Vao0O/IdD+E+m6N8eSM1aOfJilB0yrw2IDOSL/py49Ii9oNjJno7yWf6oDf3gPRzqGofTlHWCgsQQQair0Nae3SLLDYkABjr1PPrGxmc4WggkHMCKFwX4wggDhG07T7F7xJny0usD+okfaDeYDewtqBwjEmlgB6xDVFoSr48IyQFK4iEk8YQwEQWWCfjA9YQCskFlG8QGEHSABLCBBkwIAKYQYHpCQRw6wY+W/WLJFgQcCBAAIOE/LRP2NsxeImCWlwLqU3lTqeegG8wqAsezGxDPXnWCJaCAfxn7o/PhG6xSqgBIA0AYMx0AH5QrDYVMtCJctLJFB6e7vmLw6uWaO/T585RQiArzatr7awp/FVj89odmIZVt9w8Ky+Lh6cYACQHU4T73O+/EdYkSkKUoMCXNAKvWgHSGkeY6nkPX9axquzez8qe+WPEXyBgGD+b104c4fQiRsrZokpzKYzFCp+7+EfmYemAmJGIWwKjpFPN2ykWOUu3E6EEcd3KOPP5EYdm2PE5dFX2i7RpwxSgCqn9GbjavsYrU4hcyUVBbBaQUOnKCoZqLU2VYOUsGteJmI2UjErTMnS0lKEqfMSHNwA1WZ6RdyZZQHlhBTlSnIxDBNwFakAlgQKvWsefLLydnVGHAqMLs9Sf6iZiEgnMrKFLcfaDqbKaBqGzWEXk1wy0lixCQaOWokkghJdt9uER5MoBaUIIASCWILHhQv+8WCcUCknwskPcuOdKBnjO/tmkmyhxGAXMW4nBJutAWoHM4ygFLCjMXFXL2iB2hk4jOFChbQEg+NqqZquKM46RojhUFYVlQnViK1NSFBVQeWsJChPQ3d5VoI/5EksxKXdKhm+0Hc3BtFRcVpsnk7tGIwMuYF95NloRLRurXKQyODkE2NBxiu21hf5lPey3dOYLCqZcvmBZ9CCPWOlytnIU4oMhoBZRIJqDx8UY9XZNlVmrTnJ7zXM5KmzbwfvA2s8WsiSstO2Q9k45GFmEZnWvKhKAwAoGJKiGcMSaxruz+1FTe8Cgl5agk5XqG8wfQkKrakYHaeyipKpQ7vvAU5ZhAdaABl8dwb0BNEiLnskmbLnErYleWWVFZUokJKhnTvKRRRrZ7xvj09Mzy/JbNptbZYxCcyaTRY2z8Ffi3H0PDHLRlLKDNQvRjV3rTp9I3kosYre0WzM475FwwWBqNFgb9D6HfHoxlZwNFDgsURSpB0BtY9f0jO9rNgZSZ8pICDWYlg6CT5hTynXd9LjKQWcuOHAMRwvE3C4nQi9wTQgmrg/OEUI5dX4IQY0nans93R72VWUpnDv3ZOh/DuOlt0ZgmJaKsUBCoQDACoQDkFCXgiqEMMwIQYEAirEGDy9obBhWaLELccPaDLcPaEBRg88AD0iUVqShIdSiwFKkx07YmyE4eVkFVkOtTXVW3BPy5iq7G7G7tPfzR41DwJP2Et5m+8acmG8xpFzHLNccOW/4DFJUJhKQPC33vzFKc/jQqY7hn+GzH5eGkKsLlwfTN86CH1hwDX4/6fWAQ2EEn57aQog5qlj7m+g6w0sDM/i504bzyhawl9bDTrABM2XgjMnJQ/hqVM9EhnrzLc2MbogCgoBQDdFJ2VwwCFTdVlg+5P6l+kW81TAmJkCIO0JyVIKC2Yl0ijhq6ltDXlFHJwznN4gskjPnoSKlwzNS5/KM7jsUqbiVS3UgeJy7jLmdWfgXSwHqzRZ7JlHD5wrznxKRmKktUBSX0ISaC3qI8jM1KVv0ehBOMaLZCUhXiSlamYJC8wSS4U7eW3mIF2ERsTtYSZiJaglJWtRAbygk5gSlkg1DOXvuhxOOQkoClykGZVASRVwALXLgBxFVjsV3k5EuW3eKLk5TmAezmiQGYkVjDjTTotbIW18WqX/VkzqLWcziqsjpKQGoH1F8oLb5PYnb/AH6lIWoqWXV5DlAtUgEgKFRm1gSNlqWvvMQA7l1Ak5gyklK0keVqhYYhhcRJk7ISiWESlBCC2Y1BUQrwq7w3tu1oIuTjWlv+h0y0n4qXLWkZipSyRmK0uLZjwAD1G+JSsWkKy5CpbEgJVQhyAVElqsbg2jMbQwZzhM1KM4OdGR1OKgsGBezjfV9Iupakd0jJmzEhKksSt1MTVRcDwktwjknC+uytEufMyEulLkhTVILUCnNmYQnBzRNQpRDupi3iSR4qg6C4ffFbPL0X3iAs5Uqdwp1JYsQwuoMomj0iNsfaEyZMWEulAWwdznSkkAB7AhJqNRBjxu7/AMhSaSoPFYLDZskuWMyAt3dIFPERoSygNdIh9kJsiZNzSw6gCwoCKUpUk3DvdRGtdJipwCMqlKSVqSnLQ1NGAazVJrSKfAYWWJisQnwd2lKEEeFBS7KSVkBJU7AHMWpSkdmGVv8AUzndG1ThzlBIYtUXbg8KlDQhxYjeDcQrB4jwhyCqgI3VFDxrD0yXVxHo4slo4pRowW2MB3c0pFrpfUGo+p94goRV8oYNYcQOnCNf2qwzy0zG8hyn+1X6H/tGRUgV57z6fN8dZmTMPOcFCmUkhikihB0PNownabYRkLzIcyleUu+U/dUX6HX0jXIVlewAt1/aJalS5iDLmpBSsMR0YhhSuohdjOU5fjfvAAiw2/sdeFmZFVSXKF08Q6UUNR+sVYV8p+kQ0UOmE9fnpCCeI6phJ9P8YBjhHD2/+sHEcq+U/WBAIrh8rBwoEfD+8B/jxQgkiNJ2S2J38zvFj+mg2++rRI3gUJ9BrFRsvZ6p8xMtDVubhI1J+VLR1HAyESpaZaAyEvpXVzUVJofU8YaQmPqmFm623pH7/DCFu+rc95rrygiu40f40HnFH1+V6GGIaCeGoo41rDk8nKaU+Clq19obWsAs5vx3b98PKFDd20+cLQwI4XX9/wB+Hv0WtY6cbX3Hj8eCWoPe448+W7oIEpIUtCb5lpH+QFvWAR0nASO7lIR91IB5tX3iLtuaUSVs7kZRlu6qCpszu+gBMWpEVHaFf9JSa+IEUvUNSM59MqPaOcz9mzZczvJaVzXbLVJuKlZoSCXZ3bna6TslfdlUxRKwk5Cmzl2Sz1SNcwrW2mT2bMxCZstCFK7qUSTd8ud8pYuUBSTQ0AzVsI0WI2xMlzFrmS1LQpIfJUJKVWUL2tvaPInHez0E3Rmf/FYqbMyFKyvKFEmoQkvlfK+WxZN+Ea7D4GZJCu+nIVNEsspiks1QtWV2t67tYuG2xMmzP6IyALSPCPOGLZ1BizJNCaON8Ve35ipk+WhE0SnBUFqKkhSnDIAAJKq24G0Uo2K9l/gsQf5ReICEsgKC2WSShLhRykACgJbhyEBPaKScqCkqzoJylD0cNmCSEjNcO7bgTFTitvz5neZCEiWkEqysCTTKXYKdz7DWMbipudXeIL53Ckqo+8Mbjk40hQxKPRGTK+zb4bE4fMEomFKVqShKyohdHUU5ymiAQ1au4YsHkzdoSpcxS0ZlqIIKmUxG4FVNGcXB1iBhsVIElMtRHeZEgqYMMtQ9wWchze8RsNtA5imY60AkslvCumUggDMAB5DSukZTpih5Kvo0WzdoiZ41kNcoLgpKHUrKk2bLu1Bibi2lJSuXQupSkaLSovRIJ8LkkPW/ExiNpnuFSp8s95NUuYkAAjOyTmJQXy+EgNc5zekW+xMNNmATJq/HYgkhKCXsn8KTY9Y0eNQjr2a3yL6TilqmKSoBSFJ8JFSn7wU9QQGvuflf7KSEpCFoVQkJdIrlYFTC1/jxSSJiCe7fxAOC4CVJIopJBu46RIRjyha0y0KzMCSGIVQMXfR2YtrSMYNRdimm9F5jJSg2QJAAs1X0U4MOYDFk+FQIOua4pTr+UVAxE8+KY2UkPXT00iwzrJCSipUQS9CAanlaN4z+ScTNx+NMnY/D55S0EXSeoqPcCOe5AP8AXqG+sdNyxzqdLZSk0YKI10OnylI9iPRxsirSGvyoONtddIYzMpJcD0Hr7Aehh5Sbi/L8ufpeGFoNA2oDuOO/kPfdDGS8Th5eJlmXNFDVKgzpI+0m7EW9tY5jtvZczDTDLmc0qFlp3jdxGnQnpCVGvDgNRyOsNY/ZyMTKVKmUUCShbPkVoaXG8PXpCewOVlUEVQ/j8JMlTFS5gZaCxH0bgQx9YjEwhgJgQkmBCAjA8ff/AHDkqWpSglIKlKLAC5JsLQ31jddjtkd2O/mDxKDIB+yk3UQdSD78YpIRb9n9kpw0trrUAVqB1eiQTYAf9iYnTVkMC+l+Rv7fDDKpwru/bQn0/wBQ3mNHV/lw0hgHMmmtD04ajp9ILv2ua8uW7l9YbmEVObX73TWM1tvbuT+nJOZdQVOcqeQdieP1cwCNNMxiUkFaggOKqIGtawBtOWvyzUv/AH1sf2jC4HYeJxJzhK1v9slk+ijUjlSLBXYfEt/xj0WfzES5xQ1Fs16JjnU35fOHGHcHN/qynf8A5JYr/cIwBlYzCFwVAD7K6p9DYf4xebH28mapJUMq0LSoh9xBP0MUpJ9CaaO9tGV7VbWlylolqJdRADOWUfK4SHI5aPGqSrwvwjjnafFzUzpp8BUlaiHS7A+UkKuKs+h0tGGeTS0a4YqUtgTgiZq0outVVk5VJUknzEMSDyqDeEz5okoyTZClJWKrByvWmVVnN7as5qYo9nzcTmHeAhE5XiL5gBqUpBpVn1blGnVs+UTmzEqCQe7JDlvCMxVdXhNXu8cGRJLZ1pb0KkbOm95hlSJK0S1P3hSpAVlSRlzTMtLlTWLdJO29sysqpYGRRL96tDpWaEqSwKVXejAkmJ8oeFk4tPjYBK0lYQQ7+EKKiGoxUPeE9rMkmXLVJSsFBeWJaFEJCX7xMxOiCl3f84Iu9ES07KVGycPKlpK5U6YmYpgpal1KtctEB2som2kUuO2WiSQUoKkAHxhgliQnMRUhQJYptZiY0WCxYnpUnEZcikkuHZL+VYWS4cKLF93GIeL2VmlrS4mIAcKciYTcBg4Sls1wTfhEvJemP8NNGNxQUCSAogPVixbcTfSLfZ+GW8skkJXlADfaJLB3YFgotenGJmzJfeDMtBZamFXACQQCxACQ+pFzF/iMUmXJKJ6keLxBSR4ipLZVMHc0awcHm8ynFNRaCPjOuSKmaiVLKTMmvMCiUNUp7xZUorSmxGUI4PF7srFoKVFaHzitCSySUqP4hwGm94r1SsPMCJqqr8KiAAQ5BSHB8qlFqOBYxTbP27MkYhQmlakgKoqlyCgVqKZg403wSjz2WtaNFMny05GnE58pVQeNLEhO+lwL6Q8jaczvBLlpTRVAVqBKC5TVVLfKNFQjaCZ0xaZeGQUEFSSBlUQ91KBJJFTe4ipxPaLuSUypiGU7EJKlWISlY0KTRi7sCIWPFb0hylXZt0bWnJmKRMlFKUeKrkLS/mQrc7ftF/hdvIWBkoXDv0LtrSMPNxi5EvvZq0lc7KgoHhATlJIQhyyqqJc10awe7Lg90VBThTspj4lB3AzNVxeG04ddB8ZrfZ1hFUgm7RzrHzf6i/717/vK+dY2OxZq8njBAApUGmj0HGMCvEBZKwfMSR6l/W8etilcU2efNU6HAHzEh23KPz04DeYKdKDCgof166+/OErWWobkadWYNf8AKHe8cCuvw9Y0JGhKu1tWOjfPrCkKUFUoOL0L6Gr6/HZQv63+WNR0hmZNIUgJDuXJ3cGAqf2jOWSMe2FkbtRsL+cRnQkCcgMj8aanIp9XsdDzjlkxBBINCCQQQxBFwRd+EdklL3nXrzB9Yz3a/s/3yTPkj+okf1EgEd4PvNbOB1FLsIt7Gc4MCDMHEjLTsrsrvpmdY8CDX8StB6X6Rvm8wGmg66RBwEpMqWJaLJIGlS9Sd/7xMlIfMzNTXhW0WSxIQxPL3qYBljck7rcG+cIkd1fSg14P+nrAnSClnSpL2zOH33EOhWZPtXtRUtpEuilB1EXSk0AfeW6c3iy/h32PRPedNDy0lkpNlkXJ/CDRt4MYvGzjMxE1dyVKyjgDlSOgEeg9hYMSMPLlJHkSkHiWqfUufWImxoWcMEEZUOlmITQjcRoeUSRhQzgOOIrEpMOA0aMS7M7iMJLmgoKGNiFAe4jmParYJwE9OIlpCpb+JBs2o6fTgI7YZKXzMH36xn+2uATMwswEfZJ6Vhx09CbLXsxtFGIwyFoU4Ay/4gh+OVSSeJjPdoeyonLJ3ivHnFB/A7abpnSFH7i0jqFN/jHTNromZcySAE1vfStLVisquNhjdPRyw4ApShKpmYutJQQ5Fwhi1GAqHtxisw2KVLPdFlEuohsxSkFwApwz+cjL9posNv7VAWpMtIMxVCVKVSocJYgCoJNXYRXy8aGRnYLDgqDUzBgAU7ybCtBHm8bu0d1tC5vapeFSMyApJKqAJYuSxVRzUNcNB4XtOcW6ZiVKQKeFxnKy5QoO5FEvwd31rNtSCod2UlkpAqC7fefmrrD+y8EESk5lzFpJACMOqWnIbhU0LqV8R6Xi4qPDXZE7v9Cy2ylUtIEuWpitMyWUFsniSkI7sEhRASl3bzs0Sf8AzyUNLXnUwAXMykF7mo8LAqPQjSMjtifNVNGITLmS0Id1EJSR4qlgTWqaa5ekvABS3M6aopZIAdxuAAcOS4rUb4U8Wk2VCd6J+2NoypaWkLyknOVaJVUlOXVIdt1Yqv8A+iVNCQZaSoCqiATqVCzNwbQVpA2lgloDFILFioOa9AGg9jGXLWQtALi7eXQEl9+jQkopW1s0uXSeiWnEzJbhOQ5mSUpBGbUZSHAI/aJ03BqmqSZiVZ0eEqNlJYEBRNyDmY9YR/OyUrUpUtSljwnKcqSPvED7VLsLiHF4tABEvMQoVQtRU1QQXIqAzXeMrYVsclqzpMtDpAVmC0qylLChBoRc1jM7S2YCM6ahT65nU7uVFV1O+6NbgRmC5glqKihLoCdUggAKsUkkH1ijXi3ShEzwrWFZypRGXKHT5qBwU0cDxGKxco/lFJpvYxsjZhUtKpmeYlJLozE1y0YZmdgPQRutnJeY3eLChlSEqIL1qEswoRrGZ2PtSZICUhIWAsKUEklki6QaPVyHs/KNRsHDLmTEqUnxJLlbM7klqXFd2kOSc5JMVqMW0bXb2LEjBzZmqZZAbeQw9yI5rgiO7CqAGoehIYB+G7pGg/iRtMIly8OFVPjWH+yKJFC9TX/2xk8A6pbJAzGm7hT0jrm2pWvS2ea9sscNMKrI1Z8pcaU0OnS0Sp0/J4WqmpOiQWqX116RFTiEyEFBdRy5m3F65RpZzxI3xVSl95muVeYgF3vpcmkcj83JWkNLey2xs9KpBmAgZK5VKDqIFWBajlNL2jPytrlZEsBNW3tm3pLGpvuJ1ECfhDMWUKKUqAHhKWYEOAD9rjW9NHifsDszNXM8OU5TVRDAGhA1chgW47oh5E1eR7GoW9FpKmKaoCS4cU0d2Y211h3CYxDpANS/h+tddYnY3s+PtT0ZhoxDVqHBJ+cYp9r7CmecMQ3iUhT8nHmDvdmpG8fMTa4tP+C3CS7RSdsuzjheKkijvMQARxK0jd97TXe4jS7PmhKQlZzULlRqeda7m4QI9FbVklWJMqUhEycpbr8aUy0hwKsSpVA+4D9IKVt3Apcd5NR/chKh/iQ3SLfauGEzBSS3/poHQNHM8dhmJ5xyy8hrI4nVDDGUeRrsd2tSkESFZN66GYrlogcq8YLsb2pmTcT/ACs5RXLmhQGclRTMAzJIJtYjpGOlYZxEnZiRJxEqYKZJiFE8AoZvZ4I5N22EsfxpIrZX9OevNdEwuP7V1+kejcMsFKVJDuBXhHE+3OwJkjGLmEAInKzIWD4Tmaua1zXgXjfdgdsEyk4eYWmy3SUm+UeXpQenGOqStHGboQpidIjS8YBRQYwSdoELyixGsZ0WTGjN9uscmTgpq1XylKeJNGEX3fO5cMLxxT+JvaYYqcMPKLy5ZqRZSv0EOC3ZLKPsjtReEmonJchKvEB9pJYKHzUCPSOHnS8RJCkkKRMS4IsQRHm+RhWlgDT6/wC4338Me0/dL/k5qvCo/wBIk2Juj1uOLjcItPdDa0ajbnZSWtBCUgbm0jnmL2GMMWIUSVBVHApZyOMdzmpBEZjtDs4TEENGWXEqtGmPI72cqxGLXMJQkqIDgvVuXwcoqMQSAyVm7Gupdj6VEXGL2apEwlWd3OVqAeguwfrFZNwZKLDMGOU0uSxB9I5IpJnS3aHNt7RlrkoTMTMCklIUUK8Ja7g0c31rwMVGB2slJEsJCUE1JKiHeimJJTxFd9IcxkrKCmhuVJVcg6u+m/hEeRs1CyQKM7vanEcjHRHio0zGUZcrRtZGCVkSVAKAYKAUyk8SkBjb3iTJ2agZgpZzMDlzb7NT8JMUOEWtEoIU+oSpJZxoFWJIA03xPw04kMJeaZlqsnxMwZqDX2YRxSWzpXQ9OwJmnMZRLgsseE5AoZXoXJcsKFkwlWGSkhKSgMvwOp6BLk3rdVeESMamYpKFTCEJdkJJonw1PE8eJikwOGPekTAhSWKRmKk5Q5qhfVswI5PBFJrbBsPFzpkwJUhagmuUgqDMahukNSsPLY5jUkhCi5zfhUWcECzaesXCsOkju0SjlzBYUFqU4IoWVUFmcPcRosB2WM2YCpwhSUkjVt3V+sXGMm+Mejmkrdt6Mt2Z2VMmqUZeZI1PE3AOvOOqbFwCMNKUtaqJBUpSjoA5MT8BsiXLSEoSABujGduduiYv+TlK8KS81Q1IZkDlQn0G+OyGJR+T7Ink5aXRltt4g4qaucokZiMqSfKkFkhrO1+JMQE40pUAk+IHw/h3mm+L+XhCEijlgOt/nGKPGdn5kteaZMQkkuwcltHrE5oWq+yON9DU3GZZrzCVgsle40Zw268S1TpMtaZkkpLLyqvZyAVDp1e0VWNwSwQolCwNQ7j0eIKMxJD0ZmsN9hSOf/ntJi4nRB3U8oNAsEZVAV8zFjby0cxosXiikCXL8KQKkb9RwjnvZ/aOWZJSr7w14HSNotNy/teOHzMKjNfsdGCNJsQguefwxIlunxCh3w3LWkBQKS+hex/KAiaX+jH6RyqKR0tkDaEkJmBaaBYJZvKoXpxJcNygQvbNQgNWpIJZ6ftAj3vGlJ40zjnFWRdp7Q7uSmTfu0sToTq3AH6Rg8U6ljdrGw23hFMaa1jNrkVjzoZucnJ9npLFxiooaSighE+XDwQ14ek4Ncx8ot+dgOMUpA4l52U2sjFSlbLxdUqB7hZuhQFE8rtwcRkk7RXh5xlzVFMyUopEwOfK4AUwejMFgEtQgi2l/wDHy8DlxGIIMwVlSQaqVopW5If5rh8StU1alr8SlkqPMuT7mPVwzfHZ5uaEeWjo+y/4hJSAmekLH30EV51b3HIRJx38RsOGUiUVKTbMQAOjxyb+UBNHHry/f2haMGNxPr8+GNG4/RjxZqe0PbzEYkGXLORBuEUfmYz+AwwCgXc0c19ukCVJLUDD58/3F3srBOXI1+WhN3oaVFlIwngbj+cV2OwJHiAZjTh6xqEYYBjXpr6fKmE4jCOCwLH6dPjQ3EaZoewXbYTUpw+JU00USs/+pdgfx09dNRG2mScytMrW4vHA8fgSkkpHr8tGp7K9v1ymlYrMpIoJgDqSPxi6hxFed4nlemHH2ja7a2OhYIZuIjmvajBqlOoqAUQQ9GUAzU5fSOuycVLnIC5a0rSbFJcRSba7MoxJBJAbQh3q4bSMZ4/aNMeT0zjS8q1KUFKSUpT3mYBvK2VJdySQwoamHZWGyKAQlRTlAbUFSKu9GqHrvjWdqewK0DvJSQpLiod0B9QDWkXWyewKlSkrM8iaUuoAOH+yxGjGrRDTeomqku2ZORhyuWB3aVAecLbLldmAuC7Voxi3Se7BQEJQciSmuZki9qmmp3xaq7NzyMsxQADhkgOeJN4uNjdj0eZRJIINdQ1jwjFYZyZTyxRmcNhFYqhCgDwLBuFhEvF9mS41Vqw+aR0eVgUpDJSkchA/kw9Y6YeNXZhLNZRbE2ChABy6CNHLkBMIxOKlSUFcxaUJSKlRYDrHMu1v8QVzHlYR0pNDMso/2D7PM15XjoSjFGW5Mue2/bJMoKw+HU800UsV7vl+Php0Bw2xcKXBNSSCTrXnX4Yi4DZ5NSHN3Nd+vrGmwMrKBQW16wl8nZT0qJuzyBNSD90qtuYD6/SHsZggrMsh1GKrHYjuZkqaoDJVC8tWCmYneygDy6RpJWISQ4IIOoqCNCD0iM30aY+jLYnZgIJaljFZI2OQSkAlTszXjb4tSEIUVkAEdN5ik2lixLQpadQHIuaUD3bWJh8Y7HwtlBiuzagsET5UspU4BX4kkWcCg06Rs8J4pYKyjM3mQp0HiDp69Y5unbEzNVLDRhb2i92bPWlQmIpooaKHERjlhGfaNocV0a7+UNGY6xFxU+UkeOYHcMlCvETp5TSMNtlCkTliWVhCg+VKiEh7gDd+sNbLw5SsFmr9I5o+Er2yZZDWTpipkxzvFkm2jVgQ9IRUbxXe7CBHqQhSpHI3sMdr8FMLTkLlK1IGZPo1YmnYmHxMlUzDTErFiQGKTuUk1B5745dj8OXMTuy/aGbgZ3eJGZCqTEE+ZLmo3KGnNuXJPxMUrdU/tHRDPOPsn43Zy0KYim+Hf5pWDk9/TvV0lBQfKLGZls5sH0BO6NVtLtHs2ZLM3vRWpl/bfdlu/pHMNsbTXiZpmEMmyUg0SNB7D4YywePJSfL10dGbyU4VHtkTE4iZNWZkxS1rUaqVc1/f0hcmQSLe0PYXC1qC3zhzi1l4XTT/AF+0dxwlUMOXdr/q8J/ly7N7cCPzi8RIDNT45hX8sAxhbHoh4PBihb4/6RpsDhwkpNKcjviBhZYb583xYSC3D/T/AKU5RcUS2WkpGjN0pS/WsGtOlf03exIiLnDitQaem4tx94V3w0jSySHjJAUHr83V5RnMds9jTX5+vtGsKgXqPnPlESfLBuz84zlEpMyuA2hPwqiqVMUjUgWVzTY2HvGw2V/EuwxEsv8Afl/UpJp1MU07BAvbk/tEE7PpE7RWmdY2d20wk1ss9Dn7K/Ceimi8lbSQoeHKdxBEee8Tg1D4P05fGhkS1pDgkG1CB9PWJ12DR6KzpMPDGy0BypI5kR5z76c//Kv/AOZ3890CXJmKDkknjXoTyEXyJ4ndcf22wcp809BI+yg5j0S5jJ7V/ig4Iw0o7s8z6hILn1Ijn8nZyiGPzd+fWLLC7NFHHzXdByb6HxQ1idoYjGLzTpil7hZKd7JFB9WidL2c2X3+c3iXhMGAbfXh+n5xYmTWrU/QwKH2HIbw8gAWNaafP9xOSRu4abntreGkaUfWx52bieu+H0pDEN6bnDVPKkapUQ2Ix0gLTkVa1/eM2nD4iScsqapKTVqFqCrEEc41eVjpQ6cxb5pClynoR1PQAExEoKRSlRkceMRMR/VmKUmlKJHrlAf3qIvNhTET5eVZ/CQfskXHLX1iXtDCgoLjpy58/eMfOw0yQvvJRYm9edwLjhwiZRpFwns1q+ySAXSARcVpDk3CIloam9R/KM7J7XzmYy0ktdyB0aGJm0J06YnNRL2FvUn0iGkbcklomdx3iiog1I/T9IdRhQDpv9gfWJuHksBrR6fPeHwgkOxHAfS+76RdI53JsjqSxNAzq1raulPl4OHyhTsSzuNXtyvetfWBFkmMKAoAm9bc4gz8Mnj8ECBGbKKqbLDfN8TMDJHzkqBAgA0ODwaeNh9RE5GDTvN+G48IECGhCkShnbQ36CJuGwaVeEuz/nAgRSEMowifjceENChp8qIECKEOlNBXfoNG4fiPWDCaj0+rfSBAgACTQ+mg+6/1gl6ev1H6mBAgGKN/Qfn+kREoD+o/KBAhANYlA+coiqlhh81gQIgoUmWHEOyZYrTUwIEAD8sfOsSZWnEGBAikJjmep/U/rEt6H5v/AEECBFkiZUw05iHJCyx4HrQ332EFAgAkIPu70G+JMtZbr+f7dBBQIEDFlRa+m4buUVuNljKYECEwRWzsEnN6ndv3s8HhJAU5LvkzOC1Sz20qYECMF2aeixnIyChOly+6E4nFGWVAAHKaO+pYuxGkCBGhJmtn9o5i8SmSUIymtM4ILXBz0gQIEUB//9k="
                            alt=""/>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{FoodDetails.name}</h1>


                        <StarRating rating={FoodDetails.review}/>


                        <div className="mb-2 mt-2 space-x-2">
                             <span
                                 className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
        Halal - Hand Slaughtered
      </span>


                            <span
                                className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
        Contains Nuts
      </span>

                            <span
                                className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
        Kosher
      </span>
                            <span
                                className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
        Vegetarian
      </span>

                        </div>
                        <p className="text-lg mb-6 mt-4 font-bold">${FoodDetails.price}</p>

                        <div className="flex flex-col space-y-2">
                            <p>Size</p>
                            <div className="my-2 space-x-2">
                                {renderSizeButton('Small')}
                                {renderSizeButton('Medium')}
                                {renderSizeButton('Large')}
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2 mt-6 mb-8">
                            <p>Quantity</p>
                            <div>
                                <label htmlFor="Quantity" className="sr-only"> Quantity </label>

                                <div className="flex items-center border my-2 border-gray-200 px-4 rounded-full">
                                    <button
                                        onClick={decrementQuantity}
                                        type="button"
                                        className="w-10 h-10 leading-10 text-gray-600 transition hover:opacity-75"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth={1.5}
                                             stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6"/>
                                        </svg>


                                    </button>

                                    <input
                                        type="number"
                                        id="Quantity"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                                        className="h-10 w-16 border-transparent text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                                    />

                                    <button
                                        onClick={incrementQuantity}
                                        type="button"
                                        className="w-10 h-10 leading-10 text-gray-600 transition hover:opacity-75"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth={1.5}
                                             stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6"/>
                                        </svg>


                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={addToCart}
                            className="rounded-full w-full bg-primary-color hover:bg-primary-color-hover px-4 py-2.5 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color">Add
                            to Cart
                        </button>

                        <div className="my-8">
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>Description</AccordionTrigger>
                                    <AccordionContent>
                                        {FoodDetails.des}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>Ingredients</AccordionTrigger>
                                    <AccordionContent>
                                        {FoodDetails.ingredients}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                        </div>


                    </div>
                </div>
            </div>

        </>
    );
}