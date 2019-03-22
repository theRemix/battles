import * as React from "react";
import debounce from "lodash/debounce";
import Downshift from "downshift";
import styled from "../../styles/styled-components";
import Input from "../Input";
import Suggestion from "./Suggestion";

const SuggestionsWrapper = styled.div`
  position: relative;
  top: -1px;
`;

const Suggestions = styled.div`
  max-width: 22.5rem;
  border: 2px solid ${(props) => props.theme.colors.darkText};
  position: absolute;
  top: 0;
  left: 0;

  ${Suggestion}:not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.colors.darkText};
  }
`;

const fetchSearchSuggestions = debounce(async ({ text, setItems }): Promise<
  void
> => {
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://api.npmjs.org/search/suggestions?text=${text}&size=10`,
  );
  const data: any = await response.json();
  if (data.objects) {
    setItems(data.objects);
  }
}, 200);

const SearchInput: React.FunctionComponent<{}> = (props): JSX.Element => {
  const [items, setItems] = React.useState([]);
  const [inputValue, setInputValue] = React.useState("");
  const {} = props;

  return (
    <Downshift
      onChange={(selection) => console.log(`You selected ${selection}`)}
      selectedItem={inputValue}
      onStateChange={(changes) => {
        if (changes.hasOwnProperty("selectedItem")) {
          setInputValue(changes.selectedItem);
        } else if (changes.hasOwnProperty("inputValue")) {
          setInputValue(changes.inputValue || "");
        }
      }}
    >
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        isOpen,
        highlightedIndex,
      }) => (
        <div>
          <Input
            {...getInputProps({
              isOpen,
              placeholder: "Search packages",
              onChange: (event: any) => {
                const value = event.target.value;
                setItems([]);
                fetchSearchSuggestions({ text: value, setItems });
              },
            })}
          />
          <SuggestionsWrapper>
            {isOpen && inputValue ? (
              <Suggestions {...getMenuProps()}>
                {items && items.length > 0 ? (
                  items.map((item: any, index) => (
                    <Suggestion
                      key={item.package.name}
                      {...getItemProps({
                        item: item.package.name,
                        index,
                      })}
                      name={item.highlight}
                      description={item.package.description}
                      isActive={highlightedIndex === index}
                    />
                  ))
                ) : (
                  <p
                    style={{
                      width: "22.25rem",
                      padding: "0.7rem 0.5rem",
                    }}
                  >
                    ...
                  </p>
                )}
              </Suggestions>
            ) : null}
          </SuggestionsWrapper>
        </div>
      )}
    </Downshift>
  );
};

export default SearchInput;
