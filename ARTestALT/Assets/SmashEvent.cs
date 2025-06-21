using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SmashEvent : MonoBehaviour
{
    public EventTrigger_C eventT;
    // Start is called before the first frame update
    void Start()
    {
        
    }

    void Trigger()
    {
        eventT.Trigger();
    }

    RaycastHit ray;

    // Update is called once per frame
    void FixedUpdate()
    {
        Vector2 mousePos = Input.mousePosition;

        Ray _aux = Camera.main.ScreenPointToRay(Input.mousePosition);
        if (Physics.Raycast(_aux, out ray))
        {

            if (ray.transform.gameObject.tag == "Interactables")
            {
                  ray.transform.SendMessage("Trigger");
            }
        }
    }
}
