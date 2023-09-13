import * as styles from "./LayeredMap.module.scss";
import React from "react";
import MarkerMapLayer from "./MarkerLayer";
import CountryStatisticsLayer from "./CountryStatisticsLayer";

export default function MapLegend({
                                      children
                                  }) {

    return <div className={styles.legends}>
        {/** marker Layer */}
        {React.Children.map(children, (child) => {
            if (child.type === MarkerMapLayer) {
                return (
                    <div className={styles.legend}>

                        {React.cloneElement(child,
                            {
                                renderLegend: true
                            }
                        )}
                    </div>

                )
            }
        })}

        {/** country statistics Layer */}
        {React.Children.map(children, (child) => {
            if (child.type === CountryStatisticsLayer) {

                return (
                    <div className={styles.legend}>

                        {React.cloneElement(child,
                            {
                                renderLegend: true
                            }
                        )}
                    </div>

                )
            }
        })}


    </div>
}
